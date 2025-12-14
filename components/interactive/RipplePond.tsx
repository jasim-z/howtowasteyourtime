import React, { useState } from 'react';
import { View, Pressable, Dimensions, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { haptics } from '@/lib/haptics';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface Ripple {
  id: string;
  x: number;
  y: number;
}

export function RipplePond() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleTap = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    haptics.light();
    
    const newRipple: Ripple = {
      id: Date.now().toString(),
      x: locationX,
      y: locationY,
    };
    
    setRipples((prev) => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 2000);
  };

  return (
    <Pressable
      onPress={handleTap}
      className="flex-1"
      style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Pond background with gradient */}
      <LinearGradient
        colors={['#B8E6D8', '#A0D4C4', '#8EC4B0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Subtle water texture overlay */}
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          opacity: 0.3,
        }}
      />
      
      {/* Ripples */}
      {ripples.map((ripple) => (
        <RippleAnimation key={ripple.id} x={ripple.x} y={ripple.y} />
      ))}
    </Pressable>
  );
}

function RippleAnimation({ x, y }: { x: number; y: number }) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0.6);

  React.useEffect(() => {
    scale.value = withTiming(5, { duration: 2000 });
    opacity.value = withTiming(0, { duration: 2000 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: x - 25,
          top: y - 25,
          width: 50,
          height: 50,
          borderRadius: 25,
          borderWidth: 2.5,
          borderColor: '#FFFFFF',
          backgroundColor: 'transparent',
        },
        animatedStyle,
      ]}
    />
  );
}

