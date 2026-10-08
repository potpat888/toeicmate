import { auth } from '@/lib/auth';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        userName={session?.user?.name || session?.user?.email || undefined}
      />

      <div className="flex min-h-[calc(100vh-56px)]">
        <aside className="w-60 shrink-0 border-r bg-card/30">
          <Sidebar locale={locale} />
        </aside>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}