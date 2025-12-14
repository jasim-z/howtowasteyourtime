import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Pause, Play, X } from 'lucide-react-native';
import { CircularTimer } from '@/components/CircularTimer';
import { defaultActivities } from '@/constants/activities';
import { iconMap } from '@/constants/iconMap';
import { loadCustomActivities } from '@/lib/storage';
import { Activity } from '@/lib/types';
import { useStats } from '@/lib/StatsContext';

const TOTAL_SECONDS = 300; // 5 minutes

export default function TimerScreen() {
  const router = useRouter();
  const { activityId } = useLocalSearchParams<{ activityId: string }>();
  const [remainingSeconds, setRemainingSeconds] = useState(TOTAL_SECONDS);
  const [isPaused, setIsPaused] = useState(false);
  const [activity, setActivity] = useState<Activity | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { addSession } = useStats();

  const loadActivity = useCallback(async () => {
    // First check default activities
    let foundActivity = defaultActivities.find((a) => a.id === activityId);
    
    // If not found, check custom activities
    if (!foundActivity) {
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
            };
          }
        }
      } catch (error) {
        console.error('Error loading custom activities:', error);
      }
    }
    
    setActivity(foundActivity || null);
  }, [activityId]);

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
            // Save session and navigate to complete screen
            const handleCompletion = async () => {
              if (activity) {
                await addSession(activity.name, TOTAL_SECONDS);
              }
              router.push({
                pathname: '/complete',
                params: { activityId: activityId || '' },
              });
            };
            handleCompletion();
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
  }, [isPaused, activityId, router, activity, addSession]);

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

