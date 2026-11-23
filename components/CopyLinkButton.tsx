"use client";

import { useState } from "react";

export function CopyLinkButton({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button type="button" onClick={copy} className={className}>
      {copied ? "Link copiado" : "Copiar link"}
    </button>
  );
}
