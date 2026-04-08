import { loadWaitlist } from './data';
import { DbErrorBanner } from './panels/DbErrorBanner';
import { WaitlistPanel } from './panels/WaitlistPanel';

export default async function DashboardPage() {
  const { rows, error } = await loadWaitlist();

  return (
    <div className="space-y-6">
      {error ? <DbErrorBanner message={error} /> : null}
      <WaitlistPanel waitlist={rows} />
    </div>
  );
}
