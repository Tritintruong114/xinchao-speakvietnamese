import { loadWaitlist } from './data';
import { DbErrorBanner } from './panels/DbErrorBanner';
import { WaitlistPanel } from './panels/WaitlistPanel';

export default async function DashboardWaitlistPage() {
  const { rows, error } = await loadWaitlist();

  return (
    <>
      {error ? <DbErrorBanner message={error} /> : null}
      <WaitlistPanel waitlist={rows} />
    </>
  );
}
