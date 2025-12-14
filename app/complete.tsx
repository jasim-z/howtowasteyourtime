import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { PartyPopper, Clock } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { Button } from '@/components/Button';
import { defaultActivities } from '@/constants/activities';
import { iconMap } from '@/constants/iconMap';
import { loadCustomActivities } from '@/lib/storage';
import { Activity } from '@/lib/types';
import { useStats } from '@/lib/StatsContext';
import { formatTime } from '@/lib/statsStorage';
import { checkMilestones } from '@/lib/milestones';
import { Calendar } from 'lucide-react-native';
import { haptics } from '@/lib/haptics';

export default function CompleteScreen() {
  const router = useRouter();
  const { activityId, isCustom } = useLocalSearchParams<{ activityId: string; isCustom?: string }>();
  const [activity, setActivity] = useState<Activity | null>(null);
  const { stats, refreshStats } = useStats();

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
              type: 'passive',
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
    refreshStats();
  }, [loadActivity, refreshStats]);

  const ActivityIcon = activity?.icon;
  const milestone = stats ? checkMilestones(stats) : null;

  const iconScale = useSharedValue(1);
  const confettiOpacity = useSharedValue(1);

  useEffect(() => {
    haptics.success();
    // Bounce animation for icon
    iconScale.value = withSequence(
      withSpring(1.2),
      withSpring(1)
    );

    // Fade out confetti after 3 seconds
    setTimeout(() => {
      confettiOpacity.value = withTiming(0, { duration: 500 });
    }, 3000);
  }, []);

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: iconScale.value }],
    };
  });

  const confettiAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: confettiOpacity.value,
    };
  });

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
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}>
        {/* Confetti Animation */}
        <Animated.View
          style={[confettiAnimatedStyle, { position: 'absolute', top: 0, left: 0, right: 0 }]}
          pointerEvents="none">
          <View className="flex-row justify-center flex-wrap pt-20">
            {[...Array(20)].map((_, i) => {
              const colors = ['#FF8A80', '#B8F0D8', '#E8E0F0', '#FFF8F0'];
              const color = colors[i % colors.length];
              const left = `${(i * 5) % 100}%`;
              const delay = i * 100;
              return (
                <View
                  key={i}
                  style={{
                    position: 'absolute',
                    left,
                    top: -50,
                    width: 8,
                    height: 8,
                    backgroundColor: color,
                    borderRadius: 4,
                  }}
                />
              );
            })}
          </View>
        </Animated.View>

        {/* Icon */}
        <Animated.View style={[iconAnimatedStyle, { marginTop: 64 }]}>
          <PartyPopper size={64} color="#FF8A80" />
        </Animated.View>

        {/* Title */}
        <Text 
          className="text-3xl font-bold text-text text-center mt-6"
          style={{ fontFamily: 'Nunito_700Bold' }}>
          5 minutes wasted.
        </Text>

        {/* Subtitle */}
        <Text 
          className="text-xl text-textLight text-center mt-2"
          style={{ fontFamily: 'Nunito_400Regular' }}>
          Proud of you.
        </Text>

        {/* Milestone Celebration */}
        {milestone && (
          <View className="mx-6 mt-4 bg-primary/20 rounded-2xl p-4 border-2 border-primary">
            <Text 
              className="text-lg font-semibold text-text text-center"
              style={{ fontFamily: 'Nunito_600SemiBold' }}>
              {milestone.emoji} {milestone.message}
            </Text>
          </View>
        )}

        {/* Completed Activity Card */}
        <View className="mx-6 mt-10 bg-card rounded-2xl p-5 shadow-sm">
          <Text 
            className="text-base text-textLight"
            style={{ fontFamily: 'Nunito_400Regular' }}>
            You successfully did:
          </Text>
          <View className="flex-row items-center gap-2 mt-2">
            {ActivityIcon && <ActivityIcon size={24} color="#FF8A80" />}
            <Text 
              className="text-lg font-semibold text-text"
              style={{ fontFamily: 'Nunito_600SemiBold' }}>
              {activity.name}
            </Text>
          </View>
        </View>

        {/* Stats Card */}
        {stats && (
          <View className="mx-6 mt-4 bg-secondary/30 rounded-2xl p-4">
            <View className="flex-row items-center gap-2 mb-3">
              <Clock size={16} color="#5C5470" />
              <Text 
                className="text-sm text-text"
                style={{ fontFamily: 'Nunito_500Medium' }}>
                Today: {formatTime(stats.totalSecondsToday)} wasted
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Calendar size={16} color="#5C5470" />
              <Text 
                className="text-sm text-text"
                style={{ fontFamily: 'Nunito_500Medium' }}>
                All time: {formatTime(stats.totalSecondsAllTime)}
              </Text>
            </View>
            {stats.totalSecondsToday > 0 && (
              <Text 
                className="text-xs text-textLight text-center mt-3"
                style={{ fontFamily: 'Nunito_400Regular' }}>
                You've wasted {formatTime(stats.totalSecondsToday)} today. Keep it up!
              </Text>
            )}
          </View>
        )}

        {/* Buttons */}
        <View className="mt-12 px-6 w-full">
          <Button
            title="Waste more time"
            onPress={() => router.push('/activities')}
            variant="primary"
            className="w-full"
          />
          <Pressable
            onPress={() => router.push('/')}
            className="bg-transparent py-4 mt-3">
            <Text 
              className="text-text text-lg font-medium text-center"
              style={{ fontFamily: 'Nunito_500Medium' }}>
              I'm done for now
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

