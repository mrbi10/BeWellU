export function calculateWaterTarget(weightKg: number): number {
  return weightKg * 35; // ml per day
}

export function calculateAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function calculateNextPeriod(lastPeriodDate: string, cycleLength: number): string {
  const lastDate = new Date(lastPeriodDate);
  const nextDate = new Date(lastDate);
  nextDate.setDate(nextDate.getDate() + cycleLength);
  return nextDate.toISOString().split('T')[0];
}

export function getDaysUntil(targetDate: string): number {
  const target = new Date(targetDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getPeriodPhase(lastPeriodDate: string, cycleLength: number): {
  phase: 'period' | 'safe' | 'ovulation' | 'upcoming';
  daysUntilNext: number;
  nextPeriodDate: string;
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastDate = new Date(lastPeriodDate);
  lastDate.setHours(0, 0, 0, 0);
  
  const daysSinceLastPeriod = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
  const nextPeriodDate = calculateNextPeriod(lastPeriodDate, cycleLength);
  const daysUntilNext = getDaysUntil(nextPeriodDate);
  
  let phase: 'period' | 'safe' | 'ovulation' | 'upcoming' = 'safe';
  
  if (daysSinceLastPeriod <= 5) {
    phase = 'period';
  } else if (daysSinceLastPeriod >= 12 && daysSinceLastPeriod <= 16) {
    phase = 'ovulation';
  } else if (daysUntilNext <= 3 && daysUntilNext >= 0) {
    phase = 'upcoming';
  } else {
    phase = 'safe';
  }
  
  return { phase, daysUntilNext, nextPeriodDate };
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
