import { Cloud, BrainCircuit, Circle, Eye, ArrowUpToLine, Sparkles, LucideIcon } from 'lucide-react-native';

export interface Activity {
  id: string;
  name: string;
  icon: LucideIcon;
}

export const defaultActivities: Activity[] = [
  { id: '1', name: 'Daydreaming', icon: Cloud },
  { id: '2', name: 'Overthinking', icon: BrainCircuit },
  { id: '3', name: 'Do absolutely nothing', icon: Circle },
  { id: '4', name: 'Zone out', icon: Eye },
  { id: '5', name: 'Stare at ceiling', icon: ArrowUpToLine },
  { id: '6', name: 'Exist', icon: Sparkles },
];

