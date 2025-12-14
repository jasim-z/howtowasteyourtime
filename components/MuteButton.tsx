import React, { useState, useEffect } from 'react';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Volume2, VolumeX } from 'lucide-react-native';
import { soundManager, isMuted, toggleMute } from '@/lib/sounds';
import { useTheme } from '@/lib/ThemeContext';

export function MuteButton() {
  const [muted, setMuted] = useState(false);
  const insets = useSafeAreaInsets();
  const { colors, iconColor } = useTheme();

  useEffect(() => {
    // Load initial mute state
    setMuted(isMuted());
  }, []);

  const handlePress = async () => {
    const newMuted = await toggleMute();
    setMuted(newMuted);
  };

  return (
    <Pressable
      onPress={handlePress}
      className="rounded-full p-3 shadow-sm"
      style={{ 
        position: 'absolute', 
        top: Math.max(insets.top + 8, 12), 
        right: 16,
        zIndex: 10,
        backgroundColor: colors.card + 'CC', // 80% opacity
      }}>
      {muted ? (
        <VolumeX size={20} color={iconColor} />
      ) : (
        <Volume2 size={20} color={iconColor} />
      )}
    </Pressable>
  );
}

