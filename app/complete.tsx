import React, { useEffect } from 'react';
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
import { defaultActivities, Activity } from '@/constants/activities';

export default function CompleteScreen() {
  const router = useRouter();
  const { activityId } = useLocalSearchParams<{ activityId: string }>();
  
  const activity = defaultActivities.find((a) => a.id === activityId);
  const ActivityIcon = activity?.icon;

  const iconScale = useSharedValue(1);
  const confettiOpacity = useSharedValue(1);

  useEffect(() => {
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

        {/* Stats Badge */}
        <View className="mx-6 mt-4 bg-secondary/50 rounded-xl p-3 flex-row items-center gap-2">
          <Clock size={16} color="#5C5470" />
          <Text 
            className="text-sm text-text"
            style={{ fontFamily: 'Nunito_400Regular' }}>
            Total wasted today: 5 min
          </Text>
        </View>

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

