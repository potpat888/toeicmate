'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Loader2, Copy, Check } from 'lucide-react';

interface EmailPrompt {
  id: string;
  titleTh: string;
  titleEn: string;
  contextTh: string;
  mustIncludeTh: string[];
}

const EMAIL_PROMPTS: EmailPrompt[] = [
  {
    id: 'reschedule_meeting',
    titleTh: 'ขอเลื่อนนัดหมายประชุมกับลูกค้า (Reschedule Meeting)',
    titleEn: 'Rescheduling a Client Meeting',
    contextTh: 'คุณมีนัดประชุมนำเสนอโปรเจกต์วันพรุ่งนี้เวลา 14:00 น. แต่ติดเหตุขัดข้องด่วนเรื่องข้อมูลสรุปตัวเลข จึงต้องเขียนอีเมลขอเลื่อนการประชุมไปเป็นวันศุกร์เวลาเดิมอย่างสุภาพ',
    mustIncludeTh: [
      'ขออภัยในความไม่สะดวกอย่างจริงใจ',
      'ชี้แจงเหตุผลสั้นๆ อย่างเป็นมืออาชีพ',
      'เสนอวันและเวลาใหม่ที่สะดวก (วันศุกร์ 14:00 น.)',
      'ขอให้ลูกค้ายืนยันความสะดวกกลับมา',
    ],
  },
  {
    id: 'inquire_quotation',
    titleTh: 'ขอใบเสนอราคาและสอบถามส่วนลด (Request for Quotation)',
    titleEn: 'Requesting a Price Quotation',
    contextTh: 'เขียนอีเมลถึงซัพพลายเออร์เพื่อขอใบเสนอราคาสำหรับเครื่องพิมพ์สำนักงาน 20 เครื่อง พร้อมสอบถามเรื่องเงื่อนไขการรับประกันและส่วนลดสำหรับการสั่งซื้อจำนวนมาก',
    mustIncludeTh: [
      'ระบุสินค้าและจำนวนที่ต้องการอย่างชัดเจน (20 units)',
      'สอบถามเรื่อง Bulk discount และระยะเวลาส่งมอบ (Lead time)',
      'ขอให้ส่งใบเสนอราคาภายในสัปดาห์นี้',
    ],
  },
  {
    id: 'apology_delay',
    titleTh: 'ชี้แจงและขออภัยกรณีการส่งมอบล่าช้า (Apology for Delivery Delay)',
    titleEn: 'Apology for Shipping Delay',
    contextTh: 'สินค้าของลูกค้าล็อตล่าสุดเกิดความล่าช้าจากปัญหาพิธีการศุลกากร 3 วัน คุณต้องเขียนอีเมลแจ้งลูกค้าก่อนล่วงหน้าพร้อมเสนอมาตรการเยียวยา',
    mustIncludeTh: [
      'แจ้งสถานะและวันที่คาดว่าจะถึงใหม่โดยเร็ว',
      'อธิบายสาเหตุสั้นๆ โดยไม่โทษบุคคลอื่น',
      'เสนอการยกเว้นค่าจัดส่งเพื่อแสดงความรับผิดชอบ',
    ],
  },
];

export default function EmailPracticePage() {
  const locale = useLocale();
  const [selectedPrompt, setSelectedPrompt] = useState<EmailPrompt>(EMAIL_PROMPTS[0]);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail.trim() || loading) return;

    setLoading(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/ai/email-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${selectedPrompt.titleEn}: ${selectedPrompt.contextTh}`,
          userEmail,
        }),
      });

      const data = await res.json();
      if (data.feedback && !data.feedback.error) {
        setFeedback(data.feedback);
      } else {
        // Fallback demo feedback if API key is not configured
        setFeedback({
          overallScoreTh: 'อีเมลสื่อสารได้เข้าใจและสุภาพ โครงสร้างเป็นทางการดี มีจุดที่สามารถปรับสำนวนให้กระชับและเป็นมืออาชีพยิ่งขึ้น',
          issues: [
            {
              type: 'tone',
              original: 'Sorry for this trouble',
              issue: 'ใช้ภาษาพูดทั่วไป ดูไม่ค่อยเป็นทางการในอีเมลธุรกิจ',
              suggestion: 'I sincerely apologize for any inconvenience this may cause.',
            },
            {
              type: 'vocabulary',
              original: 'Can you please reply me quickly',
              issue: 'รูปประโยคตรงเกินไปและไวยากรณ์ขาด preposition',
              suggestion: 'I would greatly appreciate your prompt reply at your earliest convenience.',
            },
          ],
          improvedVersion: `Dear Mr. Smith,\n\nI hope this email finds you well.\n\nI am writing to respectfully request rescheduling our project presentation originally set for tomorrow at 2:00 PM. Due to an unexpected delay in finalizing the financial data, I would like to propose moving our meeting to this Friday at 2:00 PM.\n\nI sincerely apologize for any inconvenience this change may cause. Please let me know if this time works for you.\n\nBest regards,\n[Your Name]`,
          strengthsTh: 'ชี้แจงประเด็นตรงเป้าหมาย และมีการแบ่งย่อหน้าทำให้อ่านง่าย',
        });
      }
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการตรวจอีเมล');
    } finally {
      setLoading(false);
    }
  };

  const copyImproved = () => {
    if (!feedback?.improvedVersion) return;
    navigator.clipboard.writeText(feedback.improvedVersion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Mail className="w-7 h-7 text-blue-600" />
          <span>{locale === 'th' ? 'Email Writing Practice — ฝึกเขียนอีเมลธุรกิจพร้อม AI ตรวจ' : 'Business Email Writing Practice'}</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          {locale === 'th'
            ? 'เลือกโจทย์การเขียนอีเมลในที่ทำงาน เขียนคำตอบ แล้วให้ AI วิเคราะห์ไวยากรณ์ ความสุภาพ พร้อมเขียนเวอร์ชันที่ดีกว่าให้เทียบดู'
            : 'Draft business emails and get AI coaching on grammar, business tone, and native-like rewrites.'}
        </p>
      </div>

      {/* Select Prompt */}
      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {locale === 'th' ? 'เลือกสถานการณ์ฝึกเขียน' : 'Select Writing Task'}
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {EMAIL_PROMPTS.map((p) => {
            const isSelected = selectedPrompt.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPrompt(p);
                  setFeedback(null);
                }}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 ring-1 ring-blue-600'
                    : 'bg-card hover:border-muted-foreground/30'
                }`}
              >
                <div>
                  <h4 className="font-bold text-sm text-foreground">{p.titleTh}</h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.contextTh}</p>
                </div>
                {isSelected && (
                  <Badge variant="default" className="w-fit text-[10px] mt-3">
                    กำลังฝึกหัวข้อนี้
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Task Requirements Card */}
      <div className="rounded-xl border bg-muted/30 p-5 space-y-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">โจทย์สถานการณ์</span>
          <p className="text-sm font-medium text-foreground mt-0.5">{selectedPrompt.contextTh}</p>
        </div>
        <div>
          <span className="text-xs font-semibold text-muted-foreground">ข้อกำหนดที่ควรระบุในอีเมล:</span>
          <ul className="list-disc list-inside text-xs text-muted-foreground mt-1 space-y-0.5">
            {selectedPrompt.mustIncludeTh.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Editor & Feedback Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Writing Editor */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center justify-between">
              <span>{locale === 'th' ? 'ร่างอีเมลของคุณ (ภาษาอังกฤษ)' : 'Your Email Draft (English)'}</span>
              <span className="text-xs text-muted-foreground font-normal">
                {userEmail.trim().split(/\s+/).filter(Boolean).length} คำ
              </span>
            </label>
            <textarea
              rows={12}
              placeholder={`Dear [Name],\n\nI am writing to...\n\nSincerely,\n[Your Name]`}
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full p-4 rounded-xl border bg-background text-sm font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <Button
            type="submit"
            disabled={!userEmail.trim() || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2 font-medium"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 text-yellow-300" />
            )}
            <span>{locale === 'th' ? 'ส่งให้ AI ตรวจและวิเคราะห์' : 'Submit for AI Review'}</span>
          </Button>
        </form>

        {/* AI Feedback Display */}
        <div>
          {loading ? (
            <div className="min-h-[350px] border rounded-xl bg-card p-8 flex flex-col items-center justify-center space-y-3 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-sm font-medium text-foreground">AI กำลังอ่านและวิเคราะห์อีเมลของคุณ...</p>
              <p className="text-xs text-muted-foreground">ตรวจไวยากรณ์ โทนความสุภาพ และเตรียมเวอร์ชันขัดเกลา</p>
            </div>
          ) : feedback ? (
            <div className="space-y-4">
              {/* Overall Assessment */}
              <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/30 dark:bg-blue-950/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    <span>{locale === 'th' ? 'การประเมินภาพรวม' : 'Overall Assessment'}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs leading-relaxed">
                  <p className="text-muted-foreground">{feedback.overallScoreTh}</p>
                  {feedback.strengthsTh && (
                    <p className="text-green-700 dark:text-green-400 font-medium">
                      ✓ จุดเด่น: {feedback.strengthsTh}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Specific Issues / Fixes */}
              {feedback.issues && feedback.issues.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {locale === 'th' ? 'จุดที่แนะนำให้ปรับปรุง' : 'Suggested Corrections'}
                  </h4>
                  <div className="space-y-2">
                    {feedback.issues.map((iss: any, i: number) => (
                      <div key={i} className="rounded-xl border p-3 bg-card text-xs space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] uppercase">
                            {iss.type}
                          </Badge>
                          <span className="text-red-600 line-through">&ldquo;{iss.original}&rdquo;</span>
                          <ArrowRight className="w-3 h-3 text-muted-foreground" />
                          <span className="text-green-600 font-semibold">&ldquo;{iss.suggestion}&rdquo;</span>
                        </div>
                        <p className="text-muted-foreground text-[11px]">{iss.issue}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Improved Native Version */}
              {feedback.improvedVersion && (
                <Card className="border-green-200 dark:border-green-900 bg-gradient-to-br from-green-50/50 to-card dark:from-green-950/20">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-bold text-green-800 dark:text-green-300">
                      {locale === 'th' ? 'เวอร์ชันที่ขัดเกลาแล้ว (Polished Version)' : 'Polished Version'}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyImproved}
                      className="text-xs h-7 gap-1"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap leading-relaxed bg-background/80 p-3 rounded-lg border">
                      {feedback.improvedVersion}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="min-h-[350px] border border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center text-muted-foreground space-y-2">
              <Mail className="w-10 h-10 opacity-30" />
              <p className="text-sm font-medium">พิมพ์อีเมลร่างของคุณแล้วกดส่งตรวจ</p>
              <p className="text-xs max-w-xs">
                AI จะช่วยตรวจไวยากรณ์ การเลือกใช้คำศัพท์ธุรกิจ และนำเสนออีเมลเวอร์ชันสมบูรณ์ให้คุณเทียบ
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
