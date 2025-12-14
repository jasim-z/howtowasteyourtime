import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
  withSpring,
  Easing,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useTheme } from '@/lib/ThemeContext';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularTimerProps {
  totalSeconds: number;
  remainingSeconds: number;
  isPaused: boolean;
}

export function CircularTimer({ totalSeconds, remainingSeconds, isPaused }: CircularTimerProps) {
  const { colors } = useTheme();
  const size = 256;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  const progress = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    const newProgress = (totalSeconds - remainingSeconds) / totalSeconds;
    progress.value = withTiming(newProgress, { duration: 800 });
  }, [remainingSeconds, totalSeconds]);

  useEffect(() => {
    if (!isPaused) {
      pulseScale.value = withRepeat(
        withTiming(1.02, {
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      );
    } else {
      pulseScale.value = withSpring(1);
    }
  }, [isPaused]);

  const animatedCircleProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - progress.value);
    return {
      strokeDashoffset,
    };
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseScale.value }],
    };
  });

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Animated.View
      style={[{ width: size, height: size }, animatedContainerStyle]}
      className="items-center justify-center">
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.textLight + '40'}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.primary}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeLinecap="round"
          animatedProps={animatedCircleProps}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={{ backgroundColor: colors.card }} className="rounded-full w-64 h-64 items-center justify-center">
        <Text 
          className="text-5xl font-bold"
          style={{ 
            fontFamily: 'Nunito_700Bold',
            lineHeight: 64,
            includeFontPadding: false,
            color: colors.text,
          }}>
          {formatTime(remainingSeconds)}
        </Text>
      </View>
    </Animated.View>
  );
}

