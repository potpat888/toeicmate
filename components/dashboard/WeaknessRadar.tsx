'use client';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { getPartLabel } from '@/lib/utils';

interface PartStat {
  part: number;
  accuracy: number;
  total: number;
}

interface WeaknessRadarProps {
  partStats: PartStat[];
}

export function WeaknessRadar({ partStats }: WeaknessRadarProps) {
  if (partStats.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-muted-foreground text-sm">
        ทำข้อสอบเพื่อดูจุดอ่อน
      </div>
    );
  }

  const data = partStats.map((s) => ({
    subject: `P${s.part}`,
    fullMark: 100,
    accuracy: s.accuracy,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
        <Radar
          name="ความแม่นยำ"
          dataKey="accuracy"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.25}
        />
        <Tooltip formatter={(v) => [`${v}%`, 'ความแม่นยำ']} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
