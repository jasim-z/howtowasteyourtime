import React, { useState, useEffect } from 'react';
import { Pressable } from 'react-native';
import { Volume2, VolumeX } from 'lucide-react-native';
import { soundManager, isMuted, toggleMute } from '@/lib/sounds';

export function MuteButton() {
  const [muted, setMuted] = useState(false);

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
      className="bg-card/80 rounded-full p-3 shadow-sm"
      style={{ position: 'absolute', top: 12, right: 16 }}>
      {muted ? (
        <VolumeX size={20} color="#5C5470" />
      ) : (
        <Volume2 size={20} color="#5C5470" />
      )}
    </Pressable>
  );
}

