'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { signIn } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState('seed@toeicmate.app');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(locale === 'th' ? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' : 'Invalid email or password');
      } else {
        router.push(`/${locale}/dashboard`);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError(locale === 'th' ? 'เกิดข้อผิดพลาดในการเชื่อมต่อ' : 'Sign in failed');
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
            {locale === 'th' ? 'เข้าสู่ระบบ ToeicMate' : 'Sign in to ToeicMate'}
          </CardTitle>
          <CardDescription className="text-xs">
            {locale === 'th'
              ? 'เตรียมสอบ TOEIC 700+ และพัฒนาภาษาอังกฤษทำงาน'
              : 'Prepare for TOEIC 700+ and workplace English communication'}
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{locale === 'th' ? 'รหัสผ่าน' : 'Password'}</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Quick Demo Hint */}
            <div className="rounded-lg bg-muted/60 p-2.5 text-[11px] text-muted-foreground">
              💡 <strong>บัญชีทดสอบทันที:</strong> {email} (รหัสผ่าน: {password})
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full font-medium"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <ArrowRight className="w-4 h-4 mr-2" />
              )}
              <span>{locale === 'th' ? 'เข้าสู่ระบบ' : 'Sign In'}</span>
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground font-semibold">หรือ</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => signIn('google', { callbackUrl: `/${locale}/dashboard` })}
              className="w-full text-xs"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{locale === 'th' ? 'เข้าสู่ระบบด้วย Google' : 'Sign in with Google'}</span>
            </Button>
          </CardContent>
        </form>

        <CardFooter className="justify-center border-t py-4 text-xs text-muted-foreground">
          <span>{locale === 'th' ? 'ยังไม่มีบัญชีผู้ใช้?' : "Don't have an account?"}</span>
          <Link href={`/${locale}/register`} className="ml-1 text-primary font-semibold hover:underline">
            {locale === 'th' ? 'สมัครสมาชิกฟรี' : 'Register free'}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
