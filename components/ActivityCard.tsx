import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { LucideIcon, Play } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Nunito_400Regular, Nunito_600SemiBold } from '@expo-google-fonts/nunito';
import { useTheme } from '@/lib/ThemeContext';

interface ActivityCardProps {
  icon: LucideIcon;
  name: string;
  selected: boolean;
  onPress: () => void;
  onLongPress?: () => void;
  isCustom?: boolean;
  isInteractive?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ActivityCard({ icon: Icon, name, selected, onPress, onLongPress, isCustom, isInteractive }: ActivityCardProps) {
  const { colors, iconColor } = useTheme();
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
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        animatedStyle,
        {
          backgroundColor: colors.card,
          borderWidth: 2,
          borderColor: selected ? colors.primary : 'transparent',
        },
      ]}
      className="rounded-3xl p-5 items-center justify-center w-[47%] shadow-sm relative">
      {isCustom && (
        <View style={{ backgroundColor: colors.secondary }} className="absolute top-2 right-2 rounded-full px-2 py-0.5">
          <Text 
            className="text-xs"
            style={{ fontFamily: 'Nunito_400Regular', fontSize: 10, color: colors.text }}>
            Custom
          </Text>
        </View>
      )}
      {isInteractive && (
        <View style={{ backgroundColor: colors.primary + '33' }} className="absolute top-2 left-2 rounded-full p-1.5">
          <Play size={12} color={colors.primary} fill={colors.primary} />
        </View>
      )}
      <Icon size={32} color={selected ? colors.primary : iconColor} />
      <Text 
        className="text-base font-semibold mt-3 text-center"
        style={{ fontFamily: 'Nunito_600SemiBold', color: colors.text }}>
        {name}
      </Text>
    </AnimatedPressable>
  );
}

