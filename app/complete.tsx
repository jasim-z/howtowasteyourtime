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
import { useTheme } from '@/lib/ThemeContext';

export default function CompleteScreen() {
  const router = useRouter();
  const { colors, iconColor } = useTheme();
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
      <SafeAreaView className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <Text 
          style={{ fontFamily: 'Nunito_400Regular', color: colors.text }}>
          Activity not found
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
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
              const confettiColors = [colors.primary, colors.secondary, colors.background, colors.card];
              const color = confettiColors[i % confettiColors.length];
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
          <PartyPopper size={64} color={colors.primary} />
        </Animated.View>

        {/* Title */}
        <Text 
          className="text-3xl font-bold text-center mt-6"
          style={{ fontFamily: 'Nunito_700Bold', color: colors.text }}>
          5 minutes wasted.
        </Text>

        {/* Subtitle */}
        <Text 
          className="text-xl text-center mt-2"
          style={{ fontFamily: 'Nunito_400Regular', color: colors.textLight }}>
          Proud of you.
        </Text>

        {/* Milestone Celebration */}
        {milestone && (
          <View style={{ backgroundColor: colors.primary + '33', borderWidth: 2, borderColor: colors.primary }} className="mx-6 mt-4 rounded-2xl p-4">
            <Text 
              className="text-lg font-semibold text-center"
              style={{ fontFamily: 'Nunito_600SemiBold', color: colors.text }}>
              {milestone.emoji} {milestone.message}
            </Text>
          </View>
        )}

        {/* Completed Activity Card */}
        <View style={{ backgroundColor: colors.card }} className="mx-6 mt-10 rounded-2xl p-5 shadow-sm">
          <Text 
            className="text-base"
            style={{ fontFamily: 'Nunito_400Regular', color: colors.textLight }}>
            You successfully did:
          </Text>
          <View className="flex-row items-center gap-2 mt-2">
            {ActivityIcon && <ActivityIcon size={24} color={colors.primary} />}
            <Text 
              className="text-lg font-semibold"
              style={{ fontFamily: 'Nunito_600SemiBold', color: colors.text }}>
              {activity.name}
            </Text>
          </View>
        </View>

        {/* Stats Card */}
        {stats && (
          <View style={{ backgroundColor: colors.secondary + '4D' }} className="mx-6 mt-4 rounded-2xl p-4">
            <View className="flex-row items-center gap-2 mb-3">
              <Clock size={16} color={iconColor} />
              <Text 
                className="text-sm"
                style={{ fontFamily: 'Nunito_500Medium', color: colors.text }}>
                Today: {formatTime(stats.totalSecondsToday)} wasted
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Calendar size={16} color={iconColor} />
              <Text 
                className="text-sm"
                style={{ fontFamily: 'Nunito_500Medium', color: colors.text }}>
                All time: {formatTime(stats.totalSecondsAllTime)}
              </Text>
            </View>
            {stats.totalSecondsToday > 0 && (
              <Text 
                className="text-xs text-center mt-3"
                style={{ fontFamily: 'Nunito_400Regular', color: colors.textLight }}>
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
              className="text-lg font-medium text-center"
              style={{ fontFamily: 'Nunito_500Medium', color: colors.text }}>
              I'm done for now
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

