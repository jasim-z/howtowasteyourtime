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

