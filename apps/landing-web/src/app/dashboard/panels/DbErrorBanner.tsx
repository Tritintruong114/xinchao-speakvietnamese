import { BrutalCard } from '@xinchao/ui-web';

export function DbErrorBanner({ message }: { message: string }) {
  return (
    <BrutalCard backgroundColor="bg-brand-red" className="mb-8 border-2 border-text-main p-6 text-white">
      <p className="text-lg font-bold">{message}</p>
      <p className="mt-2 font-semibold opacity-90">
        Set <code className="rounded bg-black/20 px-1">SUPABASE_URL</code> and{' '}
        <code className="rounded bg-black/20 px-1">SUPABASE_SERVICE_ROLE_KEY</code> for this app.
      </p>
    </BrutalCard>
  );
}
