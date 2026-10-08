'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Sidebar } from './Sidebar';

export function MobileNav({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // ปิดเมนูเมื่อเปลี่ยนหน้า
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // ล็อกการเลื่อนหน้าตอนเมนูเปิด
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="rounded-lg p-2 text-foreground hover:bg-accent"
      >
        <Menu className="h-6 w-6" />
      </button>

      {mounted &&
        createPortal(
          <div className="lg:hidden">
            {open && (
              <div
                className="fixed inset-0 z-[60] bg-black/40"
                onClick={() => setOpen(false)}
              />
            )}

            <aside
              className={`fixed inset-y-0 left-0 z-[70] w-64 transform bg-background shadow-xl transition-transform duration-200 ${
                open ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <div className="flex h-14 items-center justify-between border-b px-4">
                <span className="font-bold text-primary">ToeicMate</span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="rounded-lg p-2 hover:bg-accent"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <Sidebar locale={locale} onNavigate={() => setOpen(false)} />
            </aside>
          </div>,
          document.body
        )}
    </div>
  );
}