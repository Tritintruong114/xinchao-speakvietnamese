import { BrutalButton, BrutalCard, BrutalHeading, BrutalTag } from '@xinchao/ui-web';
import { getPrimaryDashboardAdmin } from '@/lib/dashboardAuth';
import {
  getDashboardSettingsMap,
  listDashboardAdmins,
  SETTING_AI_MODULE_SYSTEM_PROMPT,
  SETTING_ELEVENLABS,
  SETTING_ELEVENLABS_VOICE,
  SETTING_GEMINI,
} from '@/lib/dashboardSettingsDb';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import {
  createDashboardAdminAction,
  logoutDashboardAction,
  saveDashboardAiModulePromptAction,
  saveDashboardApiKeysAction,
} from './actions';

type Search = {
  keysSaved?: string;
  keysError?: string;
  promptSaved?: string;
  promptError?: string;
  adminCreated?: string;
  adminError?: string;
};

export default async function DashboardSettingsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const dbOk = Boolean(getSupabaseAdmin());
  const map = await getDashboardSettingsMap([
    SETTING_ELEVENLABS,
    SETTING_ELEVENLABS_VOICE,
    SETTING_GEMINI,
    SETTING_AI_MODULE_SYSTEM_PROMPT,
  ]);
  const admins = await listDashboardAdmins();
  const primary = getPrimaryDashboardAdmin();

  return (
    <div className="space-y-6">
      <div>
        <BrutalTag backgroundColor="bg-brand-lavender" className="mb-2" rotate="-rotate-1">
          Internal
        </BrutalTag>
        <BrutalHeading as="h1" className="text-text-main">
          Settings
        </BrutalHeading>
      </div>

      {sp.keysSaved ? (
        <p className="text-sm font-bold text-text-main">API keys saved.</p>
      ) : null}
      {sp.keysError ? (
        <p className="text-sm font-bold text-brand-primary">{sp.keysError}</p>
      ) : null}
      {sp.promptSaved ? (
        <p className="text-sm font-bold text-text-main">AI module prompt saved.</p>
      ) : null}
      {sp.promptError ? (
        <p className="text-sm font-bold text-brand-primary">{sp.promptError}</p>
      ) : null}
      {sp.adminCreated ? (
        <p className="text-sm font-bold text-text-main">Admin account created.</p>
      ) : null}
      {sp.adminError ? (
        <p className="text-sm font-bold text-brand-primary">{sp.adminError}</p>
      ) : null}

      {!dbOk ? (
        <div className="border-2 border-text-main bg-brand-cream px-4 py-3 text-sm font-bold text-text-main">
          Supabase is not configured — API keys and extra admins cannot be persisted. Set{' '}
          <code className="font-mono text-xs">SUPABASE_URL</code> and{' '}
          <code className="font-mono text-xs">SUPABASE_SERVICE_ROLE_KEY</code>, run the dashboard migration, then
          reload.
        </div>
      ) : null}

      <BrutalCard className="space-y-4 border-2 border-text-main p-6 md:p-8">
        <h2 className="text-sm font-black uppercase text-text-main">API keys</h2>
        <p className="text-sm font-semibold text-text-main/70">
          Stored in <code className="font-mono text-xs">dashboard_settings</code> (service role). Leave blank to keep
          existing value; only non-empty fields are updated.
        </p>
        <p className="text-xs font-semibold text-text-main/60">
          ElevenLabs: {map[SETTING_ELEVENLABS] ? 'configured' : 'not set'} · Voice id:{' '}
          {map[SETTING_ELEVENLABS_VOICE] ? 'set' : 'not set'} · Gemini:{' '}
          {map[SETTING_GEMINI] ? 'configured' : 'not set'}
        </p>
        <form action={saveDashboardApiKeysAction} className="space-y-4">
          <label className="block space-y-1">
            <span className="text-xs font-black uppercase text-text-main/70">ElevenLabs API key</span>
            <input
              name="elevenlabs_api_key"
              type="password"
              autoComplete="off"
              placeholder={map[SETTING_ELEVENLABS] ? '•••••••• (enter new to replace)' : ''}
              disabled={!dbOk}
              className="w-full border-2 border-text-main bg-white px-3 py-2 font-mono text-sm text-text-main disabled:opacity-50"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-black uppercase text-text-main/70">ElevenLabs voice ID (for dashboard TTS)</span>
            <input
              name="elevenlabs_voice_id"
              type="text"
              autoComplete="off"
              placeholder={map[SETTING_ELEVENLABS_VOICE] ? '•••••••• (enter new to replace)' : 'Voice id from ElevenLabs'}
              disabled={!dbOk}
              className="w-full border-2 border-text-main bg-white px-3 py-2 font-mono text-sm text-text-main disabled:opacity-50"
            />
            <span className="text-[11px] font-semibold text-text-main/55">
              Used for Library → Generate audio. Alternatively set <code className="font-mono">ELEVENLABS_VOICE_ID</code>{' '}
              on the server.
            </span>
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-black uppercase text-text-main/70">Gemini API key</span>
            <input
              name="gemini_api_key"
              type="password"
              autoComplete="off"
              placeholder={map[SETTING_GEMINI] ? '•••••••• (enter new to replace)' : ''}
              disabled={!dbOk}
              className="w-full border-2 border-text-main bg-white px-3 py-2 font-mono text-sm text-text-main disabled:opacity-50"
            />
          </label>
          <BrutalButton type="submit" disabled={!dbOk}>
            Save API keys
          </BrutalButton>
        </form>
      </BrutalCard>

      <BrutalCard className="space-y-4 border-2 border-text-main p-6 md:p-8">
        <h2 className="text-sm font-black uppercase text-text-main">AI — Module generation</h2>
        <p className="text-sm font-semibold text-text-main/70">
          Injected as Gemini <strong>systemInstruction</strong> (high priority). Applies to module title, all step
          copy, and <strong>cover image choice</strong> (<code className="font-mono text-xs">image_url</code>) — describe
          palette, illustration vs photo, mood, and brand cues so the model picks a matching stock image, not a random
          generic. Core Pha A JSON rules stay in code.
        </p>
        <p className="text-xs font-semibold text-text-main/55">
          Stored in <code className="font-mono text-xs">dashboard_settings</code> key{' '}
          <code className="font-mono text-xs">ai_module_system_prompt</code>. Clear the box and save to remove.
        </p>
        <form action={saveDashboardAiModulePromptAction} className="space-y-4">
          <label className="block space-y-1">
            <span className="text-xs font-black uppercase text-text-main/70">System prompt (design system)</span>
            <textarea
              name="ai_module_system_prompt"
              rows={12}
              disabled={!dbOk}
              defaultValue={map[SETTING_AI_MODULE_SYSTEM_PROMPT] ?? ''}
              className="min-h-[12rem] w-full border-2 border-text-main bg-white px-3 py-2 font-mono text-sm text-text-main disabled:opacity-50"
              placeholder="e.g. Neo-brutalist microcopy; keep titles under 8 words; prefer Southern phrasing for food stalls..."
            />
          </label>
          <BrutalButton type="submit" variant="secondary" disabled={!dbOk}>
            Save module AI prompt
          </BrutalButton>
        </form>
      </BrutalCard>

      <BrutalCard className="space-y-4 border-2 border-text-main p-6 md:p-8">
        <h2 className="text-sm font-black uppercase text-text-main">Admin accounts</h2>
        <p className="text-sm font-semibold text-text-main/70">
          Primary login is <span className="font-mono">{primary.email}</span> (env / default). Additional admins are
          stored in <code className="font-mono text-xs">dashboard_admins</code>.
        </p>
        {admins.length > 0 ? (
          <ul className="space-y-1 text-sm font-semibold text-text-main">
            {admins.map((a) => (
              <li key={a.email}>
                <span className="font-mono">{a.email}</span>
                <span className="text-text-main/50"> · since {new Date(a.created_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm font-semibold text-text-main/60">No additional admins yet.</p>
        )}
        <form action={createDashboardAdminAction} className="space-y-4 border-t-2 border-text-main/15 pt-4">
          <p className="text-xs font-black uppercase text-text-main/70">Create admin (dashboard login only)</p>
          <label className="block space-y-1">
            <span className="text-xs font-black uppercase text-text-main/70">Email</span>
            <input
              name="admin_email"
              type="email"
              required
              disabled={!dbOk}
              className="w-full border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main disabled:opacity-50"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-black uppercase text-text-main/70">Password (min 8 chars)</span>
            <input
              name="admin_password"
              type="password"
              required
              minLength={8}
              disabled={!dbOk}
              className="w-full border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main disabled:opacity-50"
            />
          </label>
          <BrutalButton type="submit" variant="secondary" disabled={!dbOk}>
            Create admin
          </BrutalButton>
        </form>
      </BrutalCard>

      <form action={logoutDashboardAction}>
        <BrutalButton type="submit" variant="secondary">
          Sign out
        </BrutalButton>
      </form>
    </div>
  );
}
