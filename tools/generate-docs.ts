/**
 * Single-agent release notes generator: git log (or file/stdin) -> one LLM call -> Markdown file.
 *
 * Requires GEMINI_API_KEY (preferred) or OPENAI_API_KEY.
 * Optional: GEMINI_MODEL, OPENAI_MODEL (default gpt-4o-mini).
 *
 * Local workflow (human-in-the-loop): pnpm run gen-docs → review/edit .md → git add/commit/push.
 *
 * Examples:
 *   pnpm run gen-docs
 *   pnpm run gen-docs -- --version v1.2.0
 *   pnpm run gen-docs -- --input ./my-log.txt
 *   git log -30 --oneline | pnpm run gen-docs -- --stdin
 *   (Luôn thêm --stdin khi pipe; mặc định đọc git log.)
 */

import { AIConfig } from '@xinchao/shared';
import { config } from 'dotenv';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { stdin as inputStdin } from 'node:process';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

config({ path: path.join(root, '.env') });
config({ path: path.join(root, 'apps/landing-web/.env') });

const OUT_DIR = path.join(root, 'apps/landing-web/content/release-notes');

/** Single-shot instruction — user-facing release note from commit log (VN via \\u escapes). */
const WRITER_PROMPT = [
  'M\u00e0y l\u00e0 Technical Writer. D\u1ef1a v\u00e0o log code n\u00e0y, h\u00e3y vi\u1ebft cho tao 1 file Markdown Release Note th\u00e2n thi\u1ec7n v\u1edbi ng\u01b0\u1eddi d\u00f9ng.',
  'Tr\u00e1nh jargon k\u1ef9 thu\u1eadt s\u00e2u; kh\u00f4ng c\u1ea7n li\u1ec7t k\u00ea hash tr\u1eeb khi th\u1eadt s\u1ef1 h\u1eefu \u00edch.',
  'G\u1ee3i \u00fd c\u1ea5u tr\u00fac: H1 t\u00ean phi\u00ean b\u1ea3n, \u0111o\u1ea1n t\u00f3m t\u1eaft, c\u00e1c m\u1ee5c nh\u01b0 M\u1edbi / C\u1ea3i thi\u1ec7n / S\u1eeda l\u1ed7i n\u1ebfu h\u1ee3p l\u00fd.',
  'CH\u1ec8 tr\u1ea3 v\u1ec1 Markdown thu\u1ea7n, kh\u00f4ng b\u1ecdc trong ``` fence.',
].join('\n');

function parseCli() {
  const { values } = parseArgs({
    options: {
      version: { type: 'string', default: 'v1.1.0' },
      input: { type: 'string' },
      stdin: { type: 'boolean', default: false },
      max: { type: 'string', default: '80' },
    },
    allowPositionals: true,
  });
  return {
    version: values.version!.replace(/\.md$/i, ''),
    inputPath: values.input,
    useStdin: values.stdin,
    maxCommits: Math.min(500, Math.max(1, parseInt(values.max ?? '80', 10) || 80)),
  };
}

function readGitLog(maxCommits: number): string {
  try {
    return execFileSync(
      'git',
      ['log', `-${maxCommits}`, '--pretty=format:%h %s', '--no-merges'],
      { cwd: root, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 },
    ).trim();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`Cannot read git log (run from repo root?). ${msg}`);
  }
}

async function readLogSource(opts: ReturnType<typeof parseCli>): Promise<string> {
  if (opts.inputPath) {
    return (await fs.readFile(path.resolve(root, opts.inputPath), 'utf8')).trim();
  }
  if (opts.useStdin) {
    const chunks: Buffer[] = [];
    for await (const chunk of inputStdin) chunks.push(Buffer.from(chunk));
    return Buffer.concat(chunks).toString('utf8').trim();
  }
  return readGitLog(opts.maxCommits);
}

function stripOuterFence(text: string): string {
  const t = text.trim();
  const m = t.match(/^```(?:markdown|md)?\s*([\s\S]*?)```$/i);
  return m ? m[1].trim() : t;
}

async function callGemini(log: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('Missing GEMINI_API_KEY in .env');

  const model = process.env.GEMINI_MODEL ?? AIConfig.DEFAULT_GEMINI_MODEL;
  const url = `${AIConfig.GEMINI_BASE_URL}/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `${WRITER_PROMPT}\n\n---\nGIT LOG:\n\n${log}`,
            },
          ],
        },
      ],
      generationConfig: { temperature: 0.4 },
    }),
  });
  const body = (await res.json()) as {
    error?: { message?: string };
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  if (!res.ok) {
    throw new Error(body.error?.message ?? `Gemini HTTP ${res.status}`);
  }
  const text = body.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned no text (safety block?).');
  return stripOuterFence(text);
}

async function callOpenAI(log: string): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('Missing OPENAI_API_KEY in .env');

  const model = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      messages: [
        { role: 'system', content: WRITER_PROMPT },
        { role: 'user', content: `GIT LOG:\n\n${log}` },
      ],
    }),
  });
  const body = (await res.json()) as {
    error?: { message?: string };
    choices?: { message?: { content?: string } }[];
  };
  if (!res.ok) {
    throw new Error(body.error?.message ?? `OpenAI HTTP ${res.status}`);
  }
  const text = body.choices?.[0]?.message?.content;
  if (!text) throw new Error('OpenAI returned no content.');
  return stripOuterFence(text);
}

async function generateMarkdown(log: string): Promise<string> {
  if (process.env.GEMINI_API_KEY) return callGemini(log);
  if (process.env.OPENAI_API_KEY) return callOpenAI(log);
  throw new Error('Need GEMINI_API_KEY or OPENAI_API_KEY in .env');
}

async function main() {
  if (!process.env.GEMINI_API_KEY && !process.env.OPENAI_API_KEY) {
    console.error('Need GEMINI_API_KEY or OPENAI_API_KEY in .env');
    process.exit(1);
  }

  const opts = parseCli();
  const log = await readLogSource(opts);
  if (!log) {
    console.error('No log content to send to the LLM.');
    process.exit(1);
  }

  const provider = process.env.GEMINI_API_KEY ? 'Gemini' : 'OpenAI';
  console.error(`Calling ${provider}...`);
  const markdown = await generateMarkdown(log);

  await fs.mkdir(OUT_DIR, { recursive: true });
  const outFile = path.join(OUT_DIR, `${opts.version}.md`);
  await fs.writeFile(outFile, markdown.trimEnd() + '\n', 'utf8');
  console.error(`Wrote ${path.relative(root, outFile)}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
