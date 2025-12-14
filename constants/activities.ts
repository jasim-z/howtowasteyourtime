import { Cloud, BrainCircuit, Circle, Eye, ArrowUpToLine, Sparkles, Grid3x3, Droplets, Pencil, LucideIcon } from 'lucide-react-native';

export interface Activity {
  id: string;
  name: string;
  icon: LucideIcon;
  type?: 'passive' | 'interactive';
  interactiveComponent?: 'bubble-wrap' | 'ripple-pond' | 'doodle-pad';
}

export const defaultActivities: Activity[] = [
  { id: '1', name: 'Daydreaming', icon: Cloud, type: 'passive' },
  { id: '2', name: 'Overthinking', icon: BrainCircuit, type: 'passive' },
  { id: '3', name: 'Do absolutely nothing', icon: Circle, type: 'passive' },
  { id: '4', name: 'Zone out', icon: Eye, type: 'passive' },
  { id: '5', name: 'Stare at ceiling', icon: ArrowUpToLine, type: 'passive' },
  { id: '6', name: 'Exist', icon: Sparkles, type: 'passive' },
  { 
    id: 'interactive-1', 
    name: 'Pop bubble wrap', 
    icon: Grid3x3,
    type: 'interactive',
    interactiveComponent: 'bubble-wrap'
  },
  { 
    id: 'interactive-2', 
    name: 'Tap the pond', 
    icon: Droplets,
    type: 'interactive',
    interactiveComponent: 'ripple-pond'
  },
  { 
    id: 'interactive-3', 
    name: 'Doodle away', 
    icon: Pencil,
    type: 'interactive',
    interactiveComponent: 'doodle-pad'
  },
];

