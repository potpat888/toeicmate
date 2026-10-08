'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Volume2, Search, MessageSquare, Mail, Phone, Presentation, Coffee, Copy, Check } from 'lucide-react';

const PHRASES = [
  // MEETING
  { situation: 'MEETING', phraseEn: "Let's get started, shall we?", phraseTh: 'เริ่มกันเลยนะครับ/ครับ', notes: 'ใช้เปิดประชุมอย่างเป็นมิตรและเป็นมืออาชีพ' },
  { situation: 'MEETING', phraseEn: "I'd like to bring up a concern regarding the timeline.", phraseTh: 'ผม/ดิฉันอยากหยิบยกเรื่องกำหนดเวลามาพูดถึง', notes: 'สุภาพกว่า "I want to talk about"' },
  { situation: 'MEETING', phraseEn: 'Could we table this item for the next meeting?', phraseTh: 'เราสามารถเลื่อนหัวข้อนี้ไปประชุมครั้งหน้าได้ไหม', notes: 'table = เลื่อน (American English)' },
  { situation: 'MEETING', phraseEn: "To summarize, we've agreed to move forward with option B.", phraseTh: 'สรุปแล้ว เราตกลงที่จะดำเนินการตามทางเลือก B', notes: 'ใช้ก่อนปิดประเด็นเพื่อยืนยันมติ' },
  { situation: 'MEETING', phraseEn: 'Can we put that in the minutes?', phraseTh: 'เราสามารถบันทึกเรื่องนั้นในรายงานการประชุมได้ไหม', notes: 'minutes = บันทึกการประชุม' },

  // EMAIL
  { situation: 'EMAIL', phraseEn: 'I hope this email finds you well.', phraseTh: 'หวังว่าคุณสบายดีนะครับ/ค่ะ', notes: 'ประโยคเปิดอีเมลยอดนิยม สุภาพและมาตรฐาน' },
  { situation: 'EMAIL', phraseEn: 'I am writing to follow up on our previous conversation.', phraseTh: 'ฉันเขียนมาเพื่อติดตามผลการสนทนาครั้งก่อนของเรา', notes: 'ใช้ติดตามงานที่คุยค้างไว้' },
  { situation: 'EMAIL', phraseEn: 'Please do not hesitate to contact me if you have any questions.', phraseTh: 'หากมีคำถามใดๆ อย่าลังเลที่จะติดต่อฉันนะครับ/ค่ะ', notes: 'ลงท้ายอีเมลอย่างเป็นทางการ' },
  { situation: 'EMAIL', phraseEn: 'I would appreciate a prompt response at your earliest convenience.', phraseTh: 'จะขอบคุณมากหากได้รับการตอบกลับโดยเร็วตามความสะดวกของคุณ', notes: 'เร่งงานอย่างสุภาพโดยไม่กดดัน' },
  { situation: 'EMAIL', phraseEn: 'Kindly refer to the attached document for further details.', phraseTh: 'กรุณาดูเอกสารที่แนบมาสำหรับรายละเอียดเพิ่มเติม', notes: 'เป็นทางการและสละสลวยกว่า See attachment' },

  // PHONE
  { situation: 'PHONE', phraseEn: "I'm afraid he's in a meeting right now. May I take a message?", phraseTh: 'เขาอยู่ในการประชุมขณะนี้ครับ/ค่ะ ขอรับฝากข้อความได้ไหม', notes: 'รับโทรศัพท์แทนเพื่อนร่วมงานอย่างมืออาชีพ' },
  { situation: 'PHONE', phraseEn: 'Could you speak up a little? The line is not very clear.', phraseTh: 'คุณช่วยพูดดังขึ้นหน่อยได้ไหม สัญญาณไม่ค่อยดี', notes: 'ขอให้คู่สนทนาพูดดังขึ้นโดยไม่เสียมารยาท' },
  { situation: 'PHONE', phraseEn: 'Let me put you on hold for just a moment.', phraseTh: 'ขอให้คุณรอสักครู่นะครับ/ค่ะ', notes: 'ขอพักสายเพื่อตรวจสอบข้อมูล' },
  { situation: 'PHONE', phraseEn: "I'll have her call you back as soon as possible.", phraseTh: 'ฉันจะให้เธอโทรกลับหาคุณโดยเร็วที่สุด', notes: 'รับปากอย่างมั่นใจ' },

  // PRESENTATION
  { situation: 'PRESENTATION', phraseEn: 'If you could direct your attention to this slide...', phraseTh: 'หากคุณช่วยดูที่สไลด์นี้...', notes: 'ดึงสายตากลุ่มผู้ฟังไปยังจุดสำคัญบนจอ' },
  { situation: 'PRESENTATION', phraseEn: 'The data clearly indicates that customer retention has improved.', phraseTh: 'ข้อมูลชี้ให้เห็นอย่างชัดเจนว่าการรักษาฐานลูกค้าดีขึ้น', notes: 'ใช้อ้างอิงกราฟและสถิติ' },
  { situation: 'PRESENTATION', phraseEn: "I'd be happy to elaborate on that point if needed.", phraseTh: 'ยินดีที่จะอธิบายประเด็นนั้นเพิ่มเติมถ้าต้องการ', notes: 'เปิดรับคำถามช่วง Q&A' },

  // SMALLTALK
  { situation: 'SMALLTALK', phraseEn: "It's been a busy week, hasn't it?", phraseTh: 'สัปดาห์นี้วุ่นมากเลยนะ', notes: 'เปิดการสนทนาในลิฟต์หรือก่อนเริ่มประชุม' },
  { situation: 'SMALLTALK', phraseEn: 'Did you catch the game last night?', phraseTh: 'ดูเกมกีฬาเมื่อคืนไหม', notes: 'หัวข้อคุยทั่วไปสำหรับสร้างความสนิทสนม' },
  { situation: 'SMALLTALK', phraseEn: 'It was great catching up with you!', phraseTh: 'ดีใจมากที่ได้คุยกันอีกครั้ง', notes: 'ปิดบทสนทนาแบบอบอุ่น' },
];

const SITUATIONS = [
  { key: 'ALL', labelTh: 'ทั้งหมด', labelEn: 'All', icon: null },
  { key: 'MEETING', labelTh: 'การประชุม', labelEn: 'Meetings', icon: MessageSquare },
  { key: 'EMAIL', labelTh: 'อีเมล', labelEn: 'Emails', icon: Mail },
  { key: 'PHONE', labelTh: 'คุยโทรศัพท์', labelEn: 'Phone Calls', icon: Phone },
  { key: 'PRESENTATION', labelTh: 'นำเสนองาน', labelEn: 'Presentations', icon: Presentation },
  { key: 'SMALLTALK', labelTh: 'คุยทั่วไป', labelEn: 'Small Talk', icon: Coffee },
];

export default function PhraseBankPage() {
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState('ALL');
  const [search, setSearch] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const copyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const filtered = PHRASES.filter((p) => {
    const matchesTab = activeTab === 'ALL' || p.situation === activeTab;
    const matchesSearch =
      search === '' ||
      p.phraseEn.toLowerCase().includes(search.toLowerCase()) ||
      p.phraseTh.includes(search) ||
      (p.notes && p.notes.includes(search));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-16">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {locale === 'th' ? 'Phrase Bank — คลังประโยคใช้งานจริงในที่ทำงาน' : 'Workplace Phrase Bank'}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          {locale === 'th'
            ? 'รวมประโยคสำเร็จรูปพร้อมใช้ในการประชุม เขียนอีเมล คุยโทรศัพท์ และนำเสนองาน มีเสียงอ่าน TTS ผ่าน Web Speech API'
            : 'Ready-to-use business phrases with audio pronunciation via Web Speech API.'}
        </p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-wrap gap-1.5 bg-muted/60 p-1.5 rounded-xl border">
          {SITUATIONS.map((s) => {
            const Icon = s.icon;
            const isActive = activeTab === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setActiveTab(s.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{locale === 'th' ? s.labelTh : s.labelEn}</span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
          <input
            type="text"
            placeholder={locale === 'th' ? 'ค้นหาประโยคหรือความหมาย...' : 'Search phrases...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Phrases List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item, idx) => (
          <Card key={idx} className="flex flex-col justify-between hover:border-primary/40 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2 mb-2">
                <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                  {item.situation}
                </Badge>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => speak(item.phraseEn)}
                    title="ฟังเสียงอ่าน Web Speech API"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyText(item.phraseEn, idx)}
                    title="คัดลอกประโยค"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </div>
              </div>

              <CardTitle className="text-base font-semibold text-foreground leading-snug">
                &ldquo;{item.phraseEn}&rdquo;
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-0 space-y-2">
              <p className="text-sm font-medium text-primary">{item.phraseTh}</p>
              {item.notes && (
                <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-2.5 leading-relaxed">
                  💡 {item.notes}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
