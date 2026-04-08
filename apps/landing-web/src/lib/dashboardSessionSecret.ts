/** Edge-safe: no Node-only APIs. Must match across middleware + server login. */

export function resolveDashboardSessionSecret(): string | null {
  const s = process.env.DASHBOARD_SESSION_SECRET?.trim();
  if (s) return s;
  if (process.env.NODE_ENV === 'development') {
    return 'dev-xinchao-dashboard-session-secret';
  }
  return null;
}
