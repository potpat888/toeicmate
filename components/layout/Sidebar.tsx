'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Brain,
  FileText,
  Home,
  MessageSquare,
  Mail,
  GraduationCap,
  ListChecks,
  X,
} from 'lucide-react';

const navItems = [
  {
    href: '/dashboard',
    icon: Home,
    labelTh: 'หน้าหลัก',
    labelEn: 'Dashboard',
  },
  {
    href: '/quiz',
    icon: FileText,
    labelTh: 'ทำข้อสอบ',
    labelEn: 'Quiz',
  },
  {
    href: '/vocab/review',
    icon: Brain,
    labelTh: 'คำศัพท์',
    labelEn: 'Vocab',
  },
  {
    href: '/grammar',
    icon: ListChecks,
    labelTh: 'ไวยากรณ์',
    labelEn: 'Grammar',
  },
  {
    href: '/mock-test',
    icon: GraduationCap,
    labelTh: 'สอบจำลอง',
    labelEn: 'Mock Test',
  },
  {
    href: '/phrases',
    icon: BookOpen,
    labelTh: 'ประโยคสำเร็จ',
    labelEn: 'Phrases',
  },
  {
    href: '/roleplay',
    icon: MessageSquare,
    labelTh: 'สนทนา',
    labelEn: 'Roleplay',
  },
  {
    href: '/email-practice',
    icon: Mail,
    labelTh: 'เขียนอีเมล',
    labelEn: 'Email',
  },
];

export function Sidebar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const handleToggle = () => {
      setOpen((current) => !current);
    };

    window.addEventListener('toggle-sidebar', handleToggle);

    return () => {
      window.removeEventListener('toggle-sidebar', handleToggle);
    };
  }, []);

  return (
    <>
      {/* ==============================
          Mobile Overlay
          ============================== */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40',
          'transition-opacity duration-300 lg:hidden',
          open
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        )}
        onClick={() => setOpen(false)}
      />

      {/* ==============================
          Sidebar
          ============================== */}
      <aside
        className={cn(
          /*
           * Base
           */
          'border-r bg-card',
          'transition-all duration-300 ease-in-out',
          'overflow-hidden shrink-0',

          /*
           * Mobile
           */
          'fixed left-0 top-14 z-50',
          'h-[calc(100vh-56px)] w-60',
          'shadow-xl',

          open
            ? 'translate-x-0'
            : '-translate-x-full',

          /*
           * Desktop
           *
           * เปิด  = อยู่ใน layout
           * ปิด   = เลื่อนออกจาก layout
           */
          'lg:static',
          'lg:z-auto',
          'lg:h-auto',
          'lg:min-h-[calc(100vh-56px)]',
          'lg:shadow-none',
          'lg:translate-x-0',

          open
            ? 'lg:ml-0'
            : 'lg:-ml-60'
        )}
      >
        {/* ==============================
            Mobile Header
            ============================== */}
        <div className="flex h-14 items-center justify-between border-b px-4 lg:hidden">
          <div className="flex items-center gap-2 font-bold text-primary">
            <GraduationCap className="h-5 w-5" />
            <span>ToeicMate</span>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent"
            aria-label="ปิดเมนู"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ==============================
            Navigation
            ============================== */}
        <nav className="flex w-60 min-w-60 flex-col gap-1 p-3">
          {navItems.map((item) => {
            const href = `/${locale}${item.href}`;

            const isActive =
              pathname === href ||
              pathname.startsWith(`${href}/`);

            return (
              <Link
                key={item.href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3',
                  'rounded-lg px-3 py-2.5',
                  'text-sm font-medium',
                  'transition-colors',

                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />

                <span>
                  {locale === 'th'
                    ? item.labelTh
                    : item.labelEn}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}