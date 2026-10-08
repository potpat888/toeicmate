'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { signIn } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, Loader2, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const locale = useLocale();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError(locale === 'th' ? 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร' : 'Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'สมัครสมาชิกไม่สำเร็จ');
      }

      // Auto sign in
      const signInRes = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        router.push(`/${locale}/login`);
      } else {
        router.push(`/${locale}/dashboard`);
        router.refresh();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'เกิดข้อผิดพลาดในการลงทะเบียน');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-primary/20">
        <CardHeader className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
            <GraduationCap className="w-7 h-7" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {locale === 'th' ? 'สมัครสมาชิก ToeicMate' : 'Create ToeicMate Account'}
          </CardTitle>
          <CardDescription className="text-xs">
            {locale === 'th'
              ? 'เริ่มต้นเส้นทางสู่คะแนน TOEIC 700+ วันนี้'
              : 'Begin your journey to 700+ TOEIC score today'}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-xs rounded-lg bg-destructive/10 text-destructive border border-destructive/20 font-medium">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="name">{locale === 'th' ? 'ชื่อผู้ใช้' : 'Name'}</Label>
              <Input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="สมชาย ใจดี"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">{locale === 'th' ? 'อีเมล' : 'Email'}</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">{locale === 'th' ? 'รหัสผ่าน (ขั้นต่ำ 8 ตัวอักษร)' : 'Password (min 8 chars)'}</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full font-medium"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <UserPlus className="w-4 h-4 mr-2" />
              )}
              <span>{locale === 'th' ? 'สมัครสมาชิก' : 'Create Account'}</span>
            </Button>
          </CardContent>
        </form>

        <CardFooter className="justify-center border-t py-4 text-xs text-muted-foreground">
          <span>{locale === 'th' ? 'มีบัญชีอยู่แล้ว?' : 'Already have an account?'}</span>
          <Link href={`/${locale}/login`} className="ml-1 text-primary font-semibold hover:underline">
            {locale === 'th' ? 'เข้าสู่ระบบ' : 'Sign in'}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
