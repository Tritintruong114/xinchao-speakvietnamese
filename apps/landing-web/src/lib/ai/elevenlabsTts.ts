const ELEVEN_TIMEOUT_MS = 120_000;

/** Default when `ELEVENLABS_MODEL_ID` is unset (multilingual, good for Vietnamese). */
const DEFAULT_ELEVEN_MODEL_ID = 'eleven_multilingual_v2';

function resolveElevenLabsModelId(): string {
  const v = process.env.ELEVENLABS_MODEL_ID?.trim();
  return v || DEFAULT_ELEVEN_MODEL_ID;
}

/** Optional; e.g. `mp3_44100_128` — see ElevenLabs TTS API / SDK `outputFormat`. */
function resolveElevenLabsOutputFormat(): string | undefined {
  const v = process.env.ELEVENLABS_OUTPUT_FORMAT?.trim();
  return v || undefined;
}

export async function synthesizeElevenLabsSpeech(opts: {
  apiKey: string;
  voiceId: string;
  text: string;
}): Promise<{ buffer: Buffer | null; error: string | null }> {
  const t = opts.text.trim();
  if (!t) {
    return { buffer: null, error: 'Empty text for TTS' };
  }

  const base = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(opts.voiceId)}`;
  const urlObj = new URL(base);
  const outputFormat = resolveElevenLabsOutputFormat();
  if (outputFormat) {
    urlObj.searchParams.set('output_format', outputFormat);
  }
  const url = urlObj.toString();

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'xi-api-key': opts.apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text: t,
        model_id: resolveElevenLabsModelId(),
      }),
      signal: AbortSignal.timeout(ELEVEN_TIMEOUT_MS),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      return { buffer: null, error: `ElevenLabs HTTP ${res.status}: ${errText.slice(0, 280)}` };
    }

    const ab = await res.arrayBuffer();
    return { buffer: Buffer.from(ab), error: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { buffer: null, error: msg };
  }
}
