import type { Metadata } from "next";
import Link from "next/link";
import { SignOutButton } from "@/components/panel/SignOutButton";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: LayoutProps<"/panel">) {
  const { user } = await requireAdmin();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between gap-3 border-b border-arena pb-4">
        <nav className="flex items-center gap-5 text-sm font-medium text-tinta">
          <Link href="/panel" className="hover:text-vino">Eventos</Link>
          <Link href="/panel/comunidades" className="hover:text-vino">Comunidades</Link>
          <span className="font-normal text-tinta/70">{user.email}</span>
        </nav>
        <SignOutButton />
      </div>
      <div className="pt-8">{children}</div>
    </div>
  );
}
