import React from 'react';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Sun, Moon } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '@/lib/ThemeContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ThemeToggle() {
  const { theme, toggleTheme, iconColor } = useTheme();
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePress = async () => {
    scale.value = withSpring(0.9, {}, () => {
      scale.value = withSpring(1);
    });
    await toggleTheme();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      className="bg-card/80 rounded-full p-3 shadow-sm"
      style={{
        position: 'absolute',
        top: Math.max(insets.top + 8, 12),
        right: 80, // Positioned to the left of MuteButton
        zIndex: 10,
      }}>
      <Animated.View style={animatedStyle}>
        {theme === 'light' ? (
          <Moon size={20} color={iconColor} />
        ) : (
          <Sun size={20} color={iconColor} />
        )}
      </Animated.View>
    </AnimatedPressable>
  );
}

