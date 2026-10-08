/**
 * Estimate TOEIC scores from raw correct counts.
 * Uses approximate conversion tables based on publicly available score range charts.
 * These are ESTIMATES only and not official ETS conversions.
 */

// Listening: 0-100 raw → 5-495 scaled (approximate)
const LISTENING_TABLE: [number, number][] = [
  [0, 5], [10, 50], [20, 105], [30, 165], [40, 225],
  [50, 285], [60, 345], [70, 395], [80, 435], [90, 465], [100, 495],
];

// Reading: 0-100 raw → 5-495 scaled (approximate)
const READING_TABLE: [number, number][] = [
  [0, 5], [10, 45], [20, 95], [30, 155], [40, 215],
  [50, 275], [60, 335], [70, 385], [80, 425], [90, 460], [100, 495],
];

function interpolate(table: [number, number][], raw: number): number {
  const clamped = Math.max(0, Math.min(raw, 100));
  for (let i = 0; i < table.length - 1; i++) {
    const [r0, s0] = table[i];
    const [r1, s1] = table[i + 1];
    if (clamped >= r0 && clamped <= r1) {
      const ratio = (clamped - r0) / (r1 - r0);
      return Math.round(s0 + ratio * (s1 - s0));
    }
  }
  return table[table.length - 1][1];
}

export function estimateListeningScore(rawCorrect: number, totalQuestions: number): number {
  const normalized = (rawCorrect / totalQuestions) * 100;
  return interpolate(LISTENING_TABLE, normalized);
}

export function estimateReadingScore(rawCorrect: number, totalQuestions: number): number {
  const normalized = (rawCorrect / totalQuestions) * 100;
  return interpolate(READING_TABLE, normalized);
}

export function estimateTotalScore(listeningRaw: number, listeningTotal: number, readingRaw: number, readingTotal: number): {
  listening: number;
  reading: number;
  total: number;
} {
  const listening = estimateListeningScore(listeningRaw, listeningTotal);
  const reading = estimateReadingScore(readingRaw, readingTotal);
  // Round total to nearest 5
  const total = Math.round((listening + reading) / 5) * 5;
  return { listening, reading, total };
}
