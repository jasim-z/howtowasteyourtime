import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

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
  const variantClasses = {
    primary: 'bg-primary shadow-md',
    secondary: 'bg-card border border-gray-200',
    ghost: 'bg-transparent',
  };
  const textClasses = {
    primary: 'text-white text-lg font-semibold',
    secondary: 'text-text text-lg font-semibold',
    ghost: 'text-text text-lg font-medium',
  };

  return (
    <AnimatedPressable
      onPress={disabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[animatedStyle, disabled && { opacity: 0.5 }]}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      <View className="flex-row items-center justify-center gap-2">
        <Text 
          className={textClasses[variant]}
          style={{ fontFamily: variant === 'primary' ? 'Nunito_600SemiBold' : variant === 'secondary' ? 'Nunito_600SemiBold' : 'Nunito_500Medium' }}>
          {title}
        </Text>
        {icon && icon}
      </View>
    </AnimatedPressable>
  );
}

