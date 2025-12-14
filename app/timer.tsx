import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Pause, Play, X } from 'lucide-react-native';
import { CircularTimer } from '@/components/CircularTimer';
import { InteractiveActivity } from '@/components/interactive/InteractiveActivity';
import { defaultActivities } from '@/constants/activities';
import { iconMap } from '@/constants/iconMap';
import { loadCustomActivities } from '@/lib/storage';
import { Activity } from '@/lib/types';
import { playSound } from '@/lib/sounds';
import { Nunito_400Regular, Nunito_600SemiBold } from '@expo-google-fonts/nunito';

const TOTAL_SECONDS = 300; // 5 minutes

export default function TimerScreen() {
  const router = useRouter();
  const { activityId, isCustom } = useLocalSearchParams<{ activityId: string; isCustom?: string }>();
  const [remainingSeconds, setRemainingSeconds] = useState(TOTAL_SECONDS);
  const [isPaused, setIsPaused] = useState(false);
  const [activity, setActivity] = useState<Activity | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadActivity = useCallback(async () => {
    let foundActivity: Activity | undefined;
    
    if (isCustom === 'true') {
      try {
        const customActivities = await loadCustomActivities();
        const customActivity = customActivities.find((a) => a.id === activityId);
        if (customActivity) {
          const Icon = iconMap[customActivity.iconName];
          if (Icon) {
            foundActivity = {
              id: customActivity.id,
              name: customActivity.name,
              icon: Icon,
              isCustom: true,
              type: 'passive', // Custom activities are passive by default
            };
          }
        }
      } catch (error) {
        console.error('Error loading custom activities:', error);
      }
    } else {
      foundActivity = defaultActivities.find((a) => a.id === activityId);
    }
    
    setActivity(foundActivity || null);
  }, [activityId, isCustom]);

  useEffect(() => {
    loadActivity();
  }, [loadActivity]);

  const ActivityIcon = activity?.icon;

  // Reset timer when activity changes
  useEffect(() => {
    setRemainingSeconds(TOTAL_SECONDS);
    setIsPaused(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    // Play chime sound when timer starts
    playSound('chime');
  }, [activityId]);

  useEffect(() => {
    if (!isPaused && remainingSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            // Timer finished
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            // Play complete sound before navigating
            playSound('complete');
            // Navigate to complete screen
            setTimeout(() => {
              router.push({
                pathname: '/complete',
                params: { 
                  activityId: activityId || '',
                  isCustom: isCustom || 'false',
                },
              });
            }, 300); // Small delay to let sound play
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, activityId, isCustom, router]);

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleCancel = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    router.back();
  };

  if (!activity) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Text 
          className="text-text"
          style={{ fontFamily: 'Nunito_400Regular' }}>
          Activity not found
        </Text>
      </SafeAreaView>
    );
  }

  const isInteractive = activity.type === 'interactive';
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isInteractive) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1">
          {/* Top Bar with Activity Name and Mini Timer */}
          <View className="pt-6 px-6 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              {ActivityIcon && <ActivityIcon size={20} color="#5C5470" />}
              <Text 
                className="text-lg font-semibold text-text"
                style={{ fontFamily: 'Nunito_600SemiBold' }}>
                {activity.name}
              </Text>
            </View>
            <Text 
              className="text-lg font-semibold text-text"
              style={{ fontFamily: 'Nunito_600SemiBold' }}>
              {formatTime(remainingSeconds)}
            </Text>
          </View>

          {/* Interactive Component */}
          <View className="flex-1 mt-4" style={{ paddingBottom: 100 }}>
            {activity.interactiveComponent && (
              <InteractiveActivity type={activity.interactiveComponent} />
            )}
          </View>

          {/* Bottom Controls */}
          <View className="px-6 pt-2 pb-6 flex-row justify-center items-center gap-6 bg-background">
            <Pressable
              onPress={handlePauseResume}
              className="bg-primary rounded-full p-5 shadow-md">
              {isPaused ? (
                <Play size={24} color="white" />
              ) : (
                <Pause size={24} color="white" />
              )}
            </Pressable>

            <Pressable
              onPress={handleCancel}
              className="bg-transparent flex-row items-center gap-2">
              <X size={18} color="#5C5470" />
              <Text 
                className="text-text"
                style={{ fontFamily: 'Nunito_400Regular' }}>
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Passive activity - original design
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center">
        {/* Top Section */}
        <View className="pt-8 px-6 items-center">
          <View className="flex-row items-center gap-2">
            {ActivityIcon && <ActivityIcon size={24} color="#5C5470" />}
            <Text 
              className="text-xl font-semibold text-text"
              style={{ fontFamily: 'Nunito_600SemiBold' }}>
              {activity.name}
            </Text>
          </View>
          <Text 
            className="text-base text-textLight text-center mt-1"
            style={{ fontFamily: 'Nunito_400Regular' }}>
            In progress...
          </Text>
        </View>

        {/* Timer Circle */}
        <View className="mt-12">
          <CircularTimer
            totalSeconds={TOTAL_SECONDS}
            remainingSeconds={remainingSeconds}
            isPaused={isPaused}
          />
        </View>

        {/* Encouragement Text */}
        <Text 
          className="text-lg text-textLight text-center mt-10"
          style={{ fontFamily: 'Nunito_400Regular' }}>
          {isPaused ? "Taking a break from your break?" : "You're doing great at this."}
        </Text>

        {/* Control Buttons */}
        <View className="mt-12 flex-row justify-center items-center gap-6">
          {/* Pause/Resume Button */}
          <Pressable
            onPress={handlePauseResume}
            className="bg-primary rounded-full p-5 shadow-md">
            {isPaused ? (
              <Play size={28} color="white" />
            ) : (
              <Pause size={28} color="white" />
            )}
          </Pressable>

          {/* Cancel Button */}
          <Pressable
            onPress={handleCancel}
            className="bg-transparent flex-row items-center gap-2">
            <X size={20} color="#5C5470" />
            <Text 
              className="text-text"
              style={{ fontFamily: 'Nunito_400Regular' }}>
              Give up
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

