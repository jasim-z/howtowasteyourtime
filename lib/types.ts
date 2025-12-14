import { LucideIcon } from 'lucide-react-native';

export interface Activity {
  id: string;
  name: string;
  icon: LucideIcon;
}

export interface TimerState {
  remainingSeconds: number;
  isPaused: boolean;
  selectedActivity: Activity | null;
}

