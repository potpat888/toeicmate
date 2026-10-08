'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import {
  GraduationCap,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export function Navbar({ userName }: { userName?: string }) {
  const locale = useLocale();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const toggleSidebar = () => {
    window.dispatchEvent(new Event('toggle-sidebar'));
  };

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-3 border-b bg-background/95 backdrop-blur px-4 lg:px-6">

      {/* ปุ่มเปิด/ปิด Sidebar */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        aria-label="เปิด/ปิดเมนู"
      >
        <span className="text-xl">☰</span>
      </Button>

      <Link
        href={`/${locale}/dashboard`}
        className="flex items-center gap-2 font-bold text-primary"
      >
        <GraduationCap className="h-5 w-5" />
        <span>ToeicMate</span>
      </Link>

      <div className="ml-auto flex items-center gap-2">

        {/* เปลี่ยนภาษา */}
        <Link
          href={locale === 'th' ? '/en/dashboard' : '/th/dashboard'}
          className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-accent"
        >
          {locale === 'th' ? 'EN' : 'ไทย'}
        </Link>

        {/* Dark Mode */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDark((d) => !d)}
        >
          {dark ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        {/* User */}
        {userName && (
          <span className="hidden text-sm text-muted-foreground lg:block">
            {userName}
          </span>
        )}

        {/* Logout */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            signOut({ callbackUrl: `/${locale}/login` })
          }
        >
          <LogOut className="h-4 w-4" />
        </Button>

      </div>
    </header>
  );
}