import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/sidebar";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar user={session.user} />
      <main className="flex-1 overflow-y-auto">
        <div className="container py-8">{children}</div>
      </main>
    </div>
  );
}
