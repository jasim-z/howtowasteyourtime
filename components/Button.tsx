import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/lib/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  icon,
  className = '',
}: ButtonProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withTiming(0.96, { duration: 100 });
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      scale.value = withSpring(1);
    }
  };

  const baseClasses = 'rounded-full py-4 px-8 items-center justify-center';
  
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: colors.primary };
      case 'secondary':
        return { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.textLight + '40' };
      case 'ghost':
        return { backgroundColor: 'transparent' };
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return '#FFFFFF';
      case 'secondary':
        return colors.text;
      case 'ghost':
        return colors.text;
    }
  };

  return (
    <AnimatedPressable
      onPress={disabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        animatedStyle,
        disabled && { opacity: 0.5 },
        getVariantStyle(),
        variant === 'primary' && { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
      ]}
      className={`${baseClasses} ${className}`}>
      <View className="flex-row items-center justify-center gap-2">
        <Text 
          className="text-lg font-semibold"
          style={{ 
            fontFamily: variant === 'primary' ? 'Nunito_600SemiBold' : variant === 'secondary' ? 'Nunito_600SemiBold' : 'Nunito_500Medium',
            color: getTextColor(),
          }}>
          {title}
        </Text>
        {icon && icon}
      </View>
    </AnimatedPressable>
  );
}

