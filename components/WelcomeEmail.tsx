"use client";

import { useSearchParams } from "next/navigation";
import { EmailPreview } from "./EmailPreview";

export function WelcomeEmail() {
  const p = useSearchParams();
  return <EmailPreview kind="bienvenida" email={p.get("email") ?? ""} follows={p.get("follows") ?? "todas las comunidades"} />;
}
