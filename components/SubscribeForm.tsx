"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/useStore";
import { inputCls } from "./Field";

export function SubscribeForm() {
  const { communities, addSubscription } = useStore();
  const params = useSearchParams();
  const router = useRouter();
  const pre = params.get("comunidad");
  const [email, setEmail] = useState("");
  const [all, setAll] = useState(!pre);
  const [picked, setPicked] = useState<string[]>(pre ? [pre] : []);
  const [error, setError] = useState("");

  const toggle = (slug: string) => {
    setAll(false);
    setPicked((p) => (p.includes(slug) ? p.filter((x) => x !== slug) : [...p, slug]));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Ese correo no se ve bien. ¿Lo revisas?");
    if (!all && picked.length === 0) return setError("Elige al menos una comunidad o todo el menú.");
    addSubscription({ email: email.trim(), communitySlugs: all ? "todas" : picked, createdAt: new Date().toISOString() });
    const follows = all ? "todas las comunidades" : communities.filter((c) => picked.includes(c.slug)).map((c) => c.name).join(", ");
    router.push(`/correo/bienvenida?${new URLSearchParams({ email: email.trim(), follows })}`);
  };

  const chip = (active: boolean) =>
    `rounded-full border-2 px-3 py-1.5 text-sm font-semibold ${active ? "border-cobalt bg-cobalt text-white" : "border-cobalt/20 bg-white text-cobalt"}`;

  return (
    <form onSubmit={submit} noValidate className="mt-8 space-y-5 rounded-2xl bg-white p-6">
      <label className="block space-y-1">
        <span className="text-sm font-semibold text-cobalt">Tu correo</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" className={inputCls} />
      </label>
      <div className="space-y-2">
        <p className="text-sm font-semibold text-cobalt">¿Qué le pones a tu cemita?</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={chip(all)} onClick={() => { setAll(true); setPicked([]); }}>🥪 Todo el menú</button>
          {communities.map((c) => (
            <button type="button" key={c.slug} className={chip(!all && picked.includes(c.slug))} onClick={() => toggle(c.slug)}>
              {c.emoji} {c.name}
            </button>
          ))}
        </div>
      </div>
      {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
      <button className="w-full rounded-full bg-yellow py-3 font-bold text-cobalt-dark hover:brightness-95">Suscribirme</button>
    </form>
  );
}
