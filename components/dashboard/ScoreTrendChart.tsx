'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDate } from '@/lib/utils';

interface Session {
  createdAt: string;
  score?: number | null;
  correctCount: number;
  totalQuestions: number;
}

interface ScoreTrendChartProps {
  sessions: Session[];
}

export function ScoreTrendChart({ sessions }: ScoreTrendChartProps) {
  const data = sessions
    .filter((s) => s.score != null)
    .map((s) => ({
      date: formatDate(s.createdAt, 'en-US'),
      score: s.score,
      accuracy: Math.round((s.correctCount / s.totalQuestions) * 100),
    }))
    .reverse();

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-muted-foreground text-sm">
        ทำข้อสอบเพื่อดูแนวโน้มคะแนน
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis domain={[0, 990]} tick={{ fontSize: 11 }} />
        <Tooltip
          contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
          formatter={(value) => [`${value} คะแนน`, 'ประมาณ']}
        />
        <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
