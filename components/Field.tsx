export function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-tinta">{label}</span>
      {children}
      {error && <span className="block text-sm font-medium text-vino">{error}</span>}
    </label>
  );
}

export const inputCls =
  "w-full rounded-lg border border-arena bg-white px-3 py-2 outline-none focus:border-vino";
