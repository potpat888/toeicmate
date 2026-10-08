import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, locale = 'th-TH') {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(date));
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function getPartLabel(part: number, locale: 'th' | 'en' = 'th'): string {
  const labels: Record<number, { th: string; en: string }> = {
    1: { th: 'พาร์ท 1 – รูปภาพ', en: 'Part 1 – Photographs' },
    2: { th: 'พาร์ท 2 – ถาม-ตอบ', en: 'Part 2 – Q&A' },
    3: { th: 'พาร์ท 3 – บทสนทนา', en: 'Part 3 – Conversations' },
    4: { th: 'พาร์ท 4 – บรรยาย', en: 'Part 4 – Talks' },
    5: { th: 'พาร์ท 5 – เติมคำ', en: 'Part 5 – Fill in' },
    6: { th: 'พาร์ท 6 – เติมในย่อหน้า', en: 'Part 6 – Paragraphs' },
    7: { th: 'พาร์ท 7 – อ่านเนื้อหา', en: 'Part 7 – Reading' },
  };
  return labels[part]?.[locale] ?? `Part ${part}`;
}
