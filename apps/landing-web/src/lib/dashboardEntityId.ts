/** Stable random id for dashboard-created rows (not user-editable). */
export function newDashboardEntityId(kind: 'survival_module' | 'saved_phrase'): string {
  const p = kind === 'survival_module' ? 'sm' : 'ph';
  try {
    const u = crypto.randomUUID().replace(/-/g, '');
    return `${p}_${u.slice(0, 12)}`;
  } catch {
    return `${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  }
}
