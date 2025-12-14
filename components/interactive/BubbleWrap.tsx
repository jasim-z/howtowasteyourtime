import React, { useState, useEffect } from 'react';
import { View, Pressable, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { haptics } from '@/lib/haptics';
import { playSound } from '@/lib/sounds';
import { useTheme } from '@/lib/ThemeContext';

const { width, height } = Dimensions.get('window');
const BUBBLE_SIZE = 50;
const GAP = 8;
const PADDING = 16;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface BubbleProps {
  index: number;
  isPopped: boolean;
  onPop: () => void;
}

function Bubble({ index, isPopped, onPop }: BubbleProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePress = () => {
    if (!isPopped) {
      haptics.light();
      playSound('pop');
      scale.value = withSpring(0.3, { damping: 15 });
      opacity.value = withTiming(0.2, { duration: 150 });
      onPop();
    }
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      disabled={isPopped}
      style={[
        {
          width: BUBBLE_SIZE,
          height: BUBBLE_SIZE,
          position: 'relative',
        },
        animatedStyle,
      ]}>
      <View
        style={{
          width: BUBBLE_SIZE,
          height: BUBBLE_SIZE,
          borderRadius: BUBBLE_SIZE / 2,
          backgroundColor: colors.card,
          borderWidth: 1.5,
          borderColor: colors.background,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2,
          overflow: 'hidden',
        }}>
        {/* Highlight/Shine effect */}
        <View
          style={{
            position: 'absolute',
            top: BUBBLE_SIZE * 0.15,
            left: BUBBLE_SIZE * 0.2,
            width: BUBBLE_SIZE * 0.4,
            height: BUBBLE_SIZE * 0.3,
            borderRadius: BUBBLE_SIZE * 0.15,
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
          }}
        />
        {/* Subtle inner shadow for depth */}
        <View
          style={{
            position: 'absolute',
            bottom: BUBBLE_SIZE * 0.1,
            right: BUBBLE_SIZE * 0.15,
            width: BUBBLE_SIZE * 0.5,
            height: BUBBLE_SIZE * 0.4,
            borderRadius: BUBBLE_SIZE * 0.25,
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
          }}
        />
      </View>
    </AnimatedPressable>
  );
}

export function BubbleWrap() {
  const [poppedBubbles, setPoppedBubbles] = useState<Set<number>>(new Set());
  const [key, setKey] = useState(0); // Key to force re-render on reset

  // Calculate bubbles per row and total rows
  const bubblesPerRow = Math.floor((width - PADDING * 2) / (BUBBLE_SIZE + GAP));
  // Account for header (~80px), controls (~120px), and safe padding
  const availableHeight = height - 250;
  const rows = Math.max(1, Math.floor(availableHeight / (BUBBLE_SIZE + GAP)));
  const totalBubbles = bubblesPerRow * rows;

  // Calculate horizontal offset to center the grid
  const totalRowWidth = bubblesPerRow * BUBBLE_SIZE + (bubblesPerRow - 1) * GAP;
  const horizontalOffset = (width - totalRowWidth - PADDING * 2) / 2;

  const handlePop = (index: number) => {
    setPoppedBubbles((prev) => {
      const newSet = new Set([...prev, index]);
      // Check if all bubbles are popped
      if (newSet.size === totalBubbles) {
        // Reset after a short delay
        setTimeout(() => {
          setPoppedBubbles(new Set());
          setKey((prev) => prev + 1); // Force re-render
        }, 800);
      }
      return newSet;
    });
  };

  const resetBubbles = () => {
    setPoppedBubbles(new Set());
    setKey((prev) => prev + 1);
  };

  useEffect(() => {
    resetBubbles();
  }, []);

  return (
    <View 
      key={key}
      className="flex-1"
      style={{ 
        paddingHorizontal: PADDING + horizontalOffset,
        paddingTop: PADDING,
        paddingBottom: PADDING + 20, // Extra bottom padding to prevent overlap
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: GAP,
      }}>
      {Array.from({ length: totalBubbles }, (_, i) => (
        <Bubble
          key={`${key}-${i}`}
          index={i}
          isPopped={poppedBubbles.has(i)}
          onPop={() => handlePop(i)}
        />
      ))}
    </View>
  );
}

