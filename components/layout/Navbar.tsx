'use client';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { GraduationCap, LogOut, Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';


export function Navbar({ userName }: { userName?: string }) {
  const locale = useLocale();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [dark]);

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-2 border-b bg-background/95 backdrop-blur px-4 lg:px-6">
      {/* ปุ่มเมนู (แสดงเฉพาะมือถือ) */}
   

      <Link href={`/${locale}/dashboard`} className="flex items-center gap-2 font-bold text-primary">
        <GraduationCap className="h-5 w-5" />
        <span>ToeicMate</span>
      </Link>

      <div className="ml-auto flex items-center gap-2">
        {/* Locale switcher */}
        <Link href={locale === 'th' ? '/en/dashboard' : '/th/dashboard'}
          className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-accent transition-colors">
          {locale === 'th' ? 'EN' : 'ไทย'}
        </Link>

        {/* Dark mode */}
        <Button variant="ghost" size="icon" onClick={() => setDark((d) => !d)}>
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* User */}
        {userName && <span className="hidden text-sm text-muted-foreground lg:block">{userName}</span>}
        <Button variant="ghost" size="icon" onClick={() => signOut({ callbackUrl: `/${locale}/login` })}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}