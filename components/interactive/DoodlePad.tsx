import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '@/lib/ThemeContext';

interface Stroke {
  id: string;
  path: string;
  color: string;
  createdAt: number;
}

const FADE_TIME = 4000; // 4 seconds

export function DoodlePad() {
  const { colors } = useTheme();
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const pathRef = React.useRef<string>('');

  const finishStroke = React.useCallback((path: string) => {
    if (path) {
      const newStroke: Stroke = {
        id: Date.now().toString(),
        path: path,
        color: colors.primary,
        createdAt: Date.now(),
      };
      setStrokes((prev) => [...prev, newStroke]);
    }
    pathRef.current = '';
    setCurrentPath('');
  }, [colors.primary]);

  const pan = Gesture.Pan()
    .onStart((event) => {
      pathRef.current = `M ${event.x} ${event.y}`;
      runOnJS(setCurrentPath)(pathRef.current);
    })
    .onUpdate((event) => {
      pathRef.current += ` L ${event.x} ${event.y}`;
      runOnJS(setCurrentPath)(pathRef.current);
    })
    .onEnd(() => {
      const finalPath = pathRef.current;
      runOnJS(finishStroke)(finalPath);
    });

  // Remove faded strokes
  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setStrokes((prev) =>
        prev.filter((stroke) => now - stroke.createdAt < FADE_TIME)
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.card }}>
      <GestureDetector gesture={pan}>
        <Animated.View className="flex-1">
          <Svg style={StyleSheet.absoluteFill}>
            {strokes.map((stroke) => {
              const age = Date.now() - stroke.createdAt;
              const opacity = Math.max(0, 1 - age / FADE_TIME);
              
              return (
                <Path
                  key={stroke.id}
                  d={stroke.path}
                  stroke={stroke.color}
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  opacity={opacity}
                />
              );
            })}
            {currentPath && (
              <Path
                d={currentPath}
                stroke={colors.primary}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            )}
          </Svg>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

