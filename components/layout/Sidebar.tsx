'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BookOpen, Brain, FileText, Home, MessageSquare, Mail, GraduationCap, ListChecks } from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: Home, labelTh: 'หน้าหลัก', labelEn: 'Dashboard' },
  { href: '/quiz', icon: FileText, labelTh: 'ทำข้อสอบ', labelEn: 'Quiz' },
  { href: '/vocab/review', icon: Brain, labelTh: 'คำศัพท์', labelEn: 'Vocab' },
  { href: '/grammar', icon: ListChecks, labelTh: 'ไวยากรณ์', labelEn: 'Grammar' },
  { href: '/mock-test', icon: GraduationCap, labelTh: 'สอบจำลอง', labelEn: 'Mock Test' },
  { href: '/phrases', icon: BookOpen, labelTh: 'ประโยคสำเร็จ', labelEn: 'Phrases' },
  { href: '/roleplay', icon: MessageSquare, labelTh: 'สนทนา', labelEn: 'Roleplay' },
  { href: '/email-practice', icon: Mail, labelTh: 'เขียนอีเมล', labelEn: 'Email' },
];

interface SidebarProps {
  locale: string;
}

export function Sidebar({ locale }: SidebarProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-3">
      {navItems.map((item) => {
        const href = `/${locale}${item.href}`;
        const isActive = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={item.href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span>{locale === 'th' ? item.labelTh : item.labelEn}</span>
          </Link>
        );
      })}
    </nav>
  );
}
