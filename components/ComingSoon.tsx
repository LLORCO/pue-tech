export function ComingSoon({ title, text }: { title: string; text: string }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-vino">Próximamente</p>
      <h1 className="mt-3 font-display text-4xl font-bold text-tinta">{title}</h1>
      <p className="mt-4 text-lg text-tinta/70">{text}</p>
    </div>
  );
}
