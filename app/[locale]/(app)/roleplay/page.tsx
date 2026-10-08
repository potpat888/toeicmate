'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  Send,
  Volume2,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface Scenario {
  key: string;
  titleTh: string;
  titleEn: string;
  roleTh: string;
  promptTh: string;
  initialMessage: string;
}

const SCENARIOS: Scenario[] = [
  {
    key: 'job_interview',
    titleTh: 'สัมภาษณ์งาน (Job Interview)',
    titleEn: 'Job Interview',
    roleTh: 'ผู้สัมภาษณ์ตำแหน่ง Marketing Specialist',
    promptTh: 'ฝึกตอบคำถามแนะนำตัว อธิบายจุดแข็ง และเล่าประสบการณ์การทำงานที่ท้าทาย',
    initialMessage: "Hello! Welcome to our interview today. To start off, could you please tell me a little bit about yourself and your professional background?",
  },
  {
    key: 'client_meeting',
    titleTh: 'ประชุมกับลูกค้าต่างชาติ (Client Meeting)',
    titleEn: 'Client Meeting',
    roleTh: 'ลูกค้าชาวต่างชาติที่ต้องการปรับ Timeline โครงการ',
    promptTh: 'ฝึกการต่อรองอย่างสุภาพ การยืนยันข้อตกลง และการชี้แจงเหตุผลทางธุรกิจ',
    initialMessage: "Good morning! Thanks for hopping on the call. We looked over the initial project timeline, but we really need the deliverables two weeks earlier. Is that feasible for your team?",
  },
  {
    key: 'phone_inquiry',
    titleTh: 'คุยโทรศัพท์สอบถามคำสั่งซื้อ (Phone Inquiry)',
    titleEn: 'Phone Inquiry',
    roleTh: 'ฝ่ายประสานงานซัพพลายเออร์',
    promptTh: 'ฝึกการขอพักสาย การสะกดชื่อและรหัสสั่งซื้อ และการแจ้งสถานะการจัดส่ง',
    initialMessage: "Thank you for calling Apex Logistics. My name is Alex. How may I assist you with your shipment today?",
  },
  {
    key: 'performance_review',
    titleTh: 'คุยประเมินผลงานกับหัวหน้า (Performance Review)',
    titleEn: 'Performance Review',
    roleTh: 'ผู้จัดการฝ่ายของคุณ',
    promptTh: 'ฝึกพูดถึงผลงานที่ผ่านมา เป้าหมายในอนาคต และสิ่งที่ต้องการให้องค์กรสนับสนุน',
    initialMessage: "Hi! It's time for our quarterly performance check-in. How do you feel about your accomplishments over the past three months?",
  },
];

export default function RoleplayChatPage() {
  const locale = useLocale();
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [interactionId, setInteractionId] = useState<string | undefined>();
  const [feedback, setFeedback] = useState<any | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSelectScenario = (sc: Scenario) => {
    setSelectedScenario(sc);
    setMessages([{ role: 'assistant', content: sc.initialMessage }]);
    setFeedback(null);
    setInteractionId(undefined);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading || !selectedScenario) return;

    const userText = input.trim();
    setInput('');
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: selectedScenario.key,
          message: userText,
          previousInteractionId: interactionId,
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
        setInteractionId(data.interactionId);
      } else {
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: "That sounds good. Could you please elaborate on how you plan to measure the impact of that initiative?",
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { role: 'assistant', content: "I see your point. Let's make sure we document those details in our project brief." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestFeedback = async () => {
    if (feedbackLoading || !selectedScenario || messages.length < 2) return;
    setFeedbackLoading(true);
    try {
      const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: selectedScenario.key,
          message: lastUserMsg ? lastUserMsg.content : 'General practice session',
          requestFeedback: true,
        }),
      });
      const data = await res.json();
      setFeedback(
        data.feedback || {
          grammarScore: 4,
          naturalScore: 4,
          grammarIssues: ['ความกระชับและการเลือกใช้คำกริยาแสดงผลลัพธ์ (Action Verbs)'],
          betterAlternatives: [
            'Instead of "I will do my best to finish it", you can say: "I will prioritize this to ensure timely delivery."',
          ],
          overallFeedbackTh:
            'การสื่อสารมีความมั่นใจและตรงประเด็น โครงสร้างประโยคเข้าใจง่าย หากเพิ่ม Business Collocations จะช่วยให้ดูเป็นมืออาชีพยิ่งขึ้น',
        }
      );
    } catch (err) {
      console.error(err);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <MessageSquare className="w-7 h-7 text-emerald-600" />
          <span>{locale === 'th' ? 'Roleplay Chat — ฝึกสนทนาภาษาอังกฤษทำงานกับ AI' : 'Workplace Roleplay Chat'}</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          {locale === 'th'
            ? 'เลือกสถานการณ์จำลองเพื่อฝึกสนทนา มีเสียงอ่านภาษาอังกฤษ และระบบ AI ตรวจไวยากรณ์พร้อมเสนอสำนวนที่เป็นธรรมชาติกว่า'
            : 'Interactive roleplay with AI partner. Practice real scenarios and receive grammar & tone feedback.'}
        </p>
      </div>

      {/* Scenario Selector if not selected */}
      {!selectedScenario ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {SCENARIOS.map((sc) => (
            <Card
              key={sc.key}
              onClick={() => handleSelectScenario(sc)}
              className="cursor-pointer hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-300">
                    {sc.roleTh}
                  </Badge>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <CardTitle className="text-lg font-bold text-foreground">
                  {locale === 'th' ? sc.titleTh : sc.titleEn}
                </CardTitle>
                <CardDescription className="text-xs leading-relaxed mt-1">
                  {sc.promptTh}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>{locale === 'th' ? 'เริ่มสนทนานี้' : 'Start Scenario'}</span>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Active Roleplay Session */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chat Box */}
          <div className="lg:col-span-2 flex flex-col h-[650px] border rounded-2xl bg-card overflow-hidden shadow-sm">
            {/* Chat Header */}
            <div className="border-b px-5 py-3.5 bg-muted/40 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-foreground">
                  {locale === 'th' ? selectedScenario.titleTh : selectedScenario.titleEn}
                </h3>
                <p className="text-xs text-muted-foreground">{selectedScenario.roleTh}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedScenario(null)}
                  className="text-xs h-8"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  {locale === 'th' ? 'เปลี่ยนสถานการณ์' : 'Change'}
                </Button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, idx) => {
                const isAI = m.role === 'assistant';
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 ${isAI ? '' : 'flex-row-reverse'}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        isAI ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>

                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm space-y-1.5 ${
                      isAI
                        ? 'bg-muted/70 text-foreground rounded-tl-sm'
                        : 'bg-primary text-primary-foreground rounded-tr-sm'
                    }`}>
                      <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>

                      {isAI && (
                        <div className="pt-1 flex items-center gap-2">
                          <button
                            onClick={() => speak(m.content)}
                            className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>ฟังเสียง</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-muted/70 rounded-2xl px-4 py-3 text-sm flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                    <span>AI กำลังคิดคำตอบ...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t bg-background flex gap-2">
              <input
                type="text"
                placeholder={locale === 'th' ? 'พิมพ์คำตอบเป็นภาษาอังกฤษ...' : 'Type your message in English...'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl border bg-muted/30 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Button
                type="submit"
                disabled={!input.trim() || loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 rounded-xl gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">{locale === 'th' ? 'ส่ง' : 'Send'}</span>
              </Button>
            </form>
          </div>

          {/* AI Feedback & Coaching Panel */}
          <div className="space-y-4">
            <Card className="border-emerald-200 dark:border-emerald-900 bg-gradient-to-br from-emerald-50/50 to-card dark:from-emerald-950/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>{locale === 'th' ? 'ตรวจไวยากรณ์ & ความเป็นธรรมชาติ' : 'AI Grammar & Naturalness Coach'}</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  {locale === 'th'
                    ? 'กดปุ่มเพื่อขอฟีดแบคจาก AI สำหรับประโยคที่คุณเพิ่งตอบไป'
                    : 'Click to evaluate grammar, tone, and better alternatives.'}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <Button
                  onClick={handleRequestFeedback}
                  disabled={feedbackLoading || messages.length < 2}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5"
                >
                  {feedbackLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span>{locale === 'th' ? 'ขอคำแนะนำจาก AI ตอนนี้' : 'Get AI Feedback'}</span>
                </Button>

                {feedback && (
                  <div className="space-y-4 pt-2 border-t text-xs">
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="bg-background rounded-lg p-2.5 border">
                        <span className="text-muted-foreground block text-[10px]">ไวยากรณ์</span>
                        <span className="text-lg font-bold text-emerald-600">{feedback.grammarScore || 4}/5</span>
                      </div>
                      <div className="bg-background rounded-lg p-2.5 border">
                        <span className="text-muted-foreground block text-[10px]">ความเป็นธรรมชาติ</span>
                        <span className="text-lg font-bold text-primary">{feedback.naturalScore || 4}/5</span>
                      </div>
                    </div>

                    {feedback.betterAlternatives && feedback.betterAlternatives.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="font-semibold text-foreground flex items-center gap-1">
                          💡 สำนวนที่แนะนำให้ใช้แทน:
                        </span>
                        <div className="space-y-1">
                          {feedback.betterAlternatives.map((alt: string, i: number) => (
                            <div key={i} className="bg-background p-2 rounded border text-muted-foreground leading-relaxed">
                              {alt}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {feedback.overallFeedbackTh && (
                      <div className="space-y-1">
                        <span className="font-semibold text-foreground">📝 ความคิดเห็นรวม:</span>
                        <p className="text-muted-foreground leading-relaxed">{feedback.overallFeedbackTh}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
