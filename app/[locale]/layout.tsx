import type { Metadata } from 'next';
import { IBM_Plex_Sans_Thai, Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '@/app/globals.css';

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['thai', 'latin'],
  variable: '--font-ibm-plex-sans-thai',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ToeicMate — เตรียมสอบ TOEIC และภาษาอังกฤษทำงาน',
  description: 'เว็บแอปฝึกทำข้อสอบ TOEIC และทักษะการสื่อสารภาษาอังกฤษในที่ทำงานสำหรับคนไทย',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${ibmPlexSansThai.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased bg-background text-foreground flex flex-col">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
