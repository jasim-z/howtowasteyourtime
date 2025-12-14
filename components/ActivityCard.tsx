import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface ActivityCardProps {
  icon: LucideIcon;
  name: string;
  selected: boolean;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ActivityCard({ icon: Icon, name, selected, onPress }: ActivityCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  React.useEffect(() => {
    if (selected) {
      scale.value = withSpring(1.05, {}, () => {
        scale.value = withSpring(1);
      });
    }
  }, [selected]);

  const handlePressIn = () => {
    scale.value = withTiming(0.96, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
      className={`bg-card rounded-3xl p-5 items-center justify-center w-[47%] shadow-sm ${
        selected ? 'border-2 border-primary' : 'border-2 border-transparent'
      }`}>
      <Icon size={32} color={selected ? '#FF8A80' : '#5C5470'} />
      <Text 
        className="text-base font-semibold text-text mt-3 text-center"
        style={{ fontFamily: 'Nunito_600SemiBold' }}>
        {name}
      </Text>
    </AnimatedPressable>
  );
}

