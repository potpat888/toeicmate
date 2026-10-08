/**
 * SM-2 Spaced Repetition Algorithm
 * Quality scale: 0 = complete blackout, 5 = perfect recall
 */
export interface SRSCard {
  interval: number;      // days until next review
  easeFactor: number;    // difficulty multiplier (min 1.3)
  repetitions: number;   // how many times reviewed successfully
}

export interface SRSResult extends SRSCard {
  nextReviewAt: Date;
}

export function calculateNextReview(card: SRSCard, quality: 0 | 1 | 2 | 3 | 4 | 5): SRSResult {
  let { interval, easeFactor, repetitions } = card;

  if (quality >= 3) {
    // Correct response
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
    easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  } else {
    // Incorrect response — reset
    repetitions = 0;
    interval = 1;
  }

  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + interval);
  nextReviewAt.setHours(0, 0, 0, 0);

  return { interval, easeFactor, repetitions, nextReviewAt };
}

/** Map UI button labels to quality scores */
export const QUALITY_LABELS = [
  { quality: 0 as const, labelTh: 'ลืมสนิท', labelEn: 'Blackout', color: 'destructive' },
  { quality: 3 as const, labelTh: 'พอจำได้', labelEn: 'Hard', color: 'secondary' },
  { quality: 4 as const, labelTh: 'จำได้', labelEn: 'Good', color: 'default' },
  { quality: 5 as const, labelTh: 'จำได้ดี', labelEn: 'Easy', color: 'outline' },
] as const;
