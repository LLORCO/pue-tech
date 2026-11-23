import Link from "next/link";
import { brand } from "@/lib/brand";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-20 bg-bosque text-blanco">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Logo light />
          <p className="max-w-sm text-blanco/75">{brand.tagline}</p>
        </div>
        <Link href="/media-kit" className="text-sm text-blanco/60 underline hover:text-vino-claro">
          Media kit
        </Link>
      </div>
    </footer>
  );
}
