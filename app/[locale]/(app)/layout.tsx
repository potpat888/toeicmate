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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar userName={session?.user?.name || session?.user?.email || undefined} />
      <div className="flex-1 flex">
        <aside className="w-60 border-r hidden md:block bg-card/30 shrink-0">
          <Sidebar locale={locale} />
        </aside>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
