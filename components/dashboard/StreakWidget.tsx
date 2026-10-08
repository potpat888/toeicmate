interface StreakWidgetProps {
  streak: number;
}

export function StreakWidget({ streak }: StreakWidgetProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-200 dark:border-orange-800 p-6">
      <div className="text-5xl mb-2">{streak > 0 ? '🔥' : '💪'}</div>
      <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">{streak}</div>
      <div className="text-sm text-orange-700 dark:text-orange-300 font-medium mt-1">วันต่อเนื่อง</div>
      {streak === 0 && <p className="text-xs text-muted-foreground mt-2 text-center">เรียนวันนี้เพื่อเริ่มสตรีค!</p>}
    </div>
  );
}
