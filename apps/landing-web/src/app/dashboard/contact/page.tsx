import { loadContacts } from '../data';
import { DbErrorBanner } from '../panels/DbErrorBanner';
import { ContactPanel } from '../panels/ContactPanel';

export default async function DashboardContactPage() {
  const { rows, error } = await loadContacts();

  return (
    <>
      {error ? <DbErrorBanner message={error} /> : null}
      <ContactPanel contacts={rows} />
    </>
  );
}
