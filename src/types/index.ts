export interface UserProfile {
  name: string;
  gender: 'male' | 'female' | 'other';
  dob: string;
  height: number; // cm
  weight: number; // kg
}

export interface WaterLog {
  date: string;
  glasses: number;
  targetMl: number;
}

export interface PeriodData {
  lastPeriodDate: string;
  cycleLength: number;
}

export interface Exam {
  id: string;
  subject: string;
  examDate: string;
  createdAt: string;
}
