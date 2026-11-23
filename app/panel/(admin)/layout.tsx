import type { Metadata } from "next";
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
        <p className="text-sm text-tinta/70">
          Panel · <span className="font-medium text-tinta">{user.email}</span>
        </p>
        <SignOutButton />
      </div>
      <div className="pt-8">{children}</div>
    </div>
  );
}
