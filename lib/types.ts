import { LucideIcon } from 'lucide-react-native';

export interface Activity {
  id: string;
  name: string;
  icon: LucideIcon;
  isCustom?: boolean;
}

export interface CustomActivity {
  id: string;
  name: string;
  iconName: string;
  isCustom: true;
}

export interface TimerState {
  remainingSeconds: number;
  isPaused: boolean;
  selectedActivity: Activity | null;
}

export interface WasteStats {
  totalSecondsAllTime: number;
  totalSecondsToday: number;
  lastActiveDate: string; // ISO date string "2024-01-15"
  sessionsToday: number;
  sessionsAllTime: number;
}

export interface SessionRecord {
  activityId: string;
  activityName: string;
  duration: number; // seconds
  completedAt: string; // ISO timestamp
}

