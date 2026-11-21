export function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-semibold text-cobalt">{label}</span>
      {children}
      {error && <span className="block text-sm font-semibold text-red-700">{error}</span>}
    </label>
  );
}

export const inputCls =
  "w-full rounded-xl border-2 border-cobalt/15 bg-white px-3 py-2 outline-none focus:border-cobalt";
