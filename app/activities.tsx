import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, ArrowRight, Plus } from 'lucide-react-native';
import { ActivityCard } from '@/components/ActivityCard';
import { Button } from '@/components/Button';
import { defaultActivities, Activity } from '@/constants/activities';

export default function ActivitiesScreen() {
  const router = useRouter();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const handleActivityPress = (activity: Activity) => {
    setSelectedActivity(activity);
  };

  const handleStartTimer = () => {
    if (selectedActivity) {
      router.push({
        pathname: '/timer',
        params: { activityId: selectedActivity.id },
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View className="pt-6 px-6">
          {/* Back Button */}
          <Pressable
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.push('/');
              }
            }}
            className="mb-4 self-start">
            <ChevronLeft size={24} color="#5C5470" />
          </Pressable>

          {/* Title */}
          <Text 
            className="text-2xl font-bold text-text"
            style={{ fontFamily: 'Nunito_700Bold' }}>
            Pick your pointless activity
          </Text>

          {/* Subtitle */}
          <Text 
            className="text-base text-textLight mt-1"
            style={{ fontFamily: 'Nunito_400Regular' }}>
            Choose wisely. Or don't.
          </Text>
        </View>

        {/* Activity Grid */}
        <View className="px-6 mt-6 flex-row flex-wrap" style={{ gap: 16 }}>
          {defaultActivities.map((activity) => {
            const Icon = activity.icon;
            return (
              <ActivityCard
                key={activity.id}
                icon={Icon}
                name={activity.name}
                selected={selectedActivity?.id === activity.id}
                onPress={() => handleActivityPress(activity)}
              />
            );
          })}

          {/* Add Custom Button */}
          <Pressable
            className="bg-transparent rounded-3xl p-5 items-center justify-center w-[47%] border-2 border-dashed border-textLight">
            <Plus size={32} color="#8E8A9D" />
            <Text 
              className="text-base text-textLight mt-3 text-center"
              style={{ fontFamily: 'Nunito_400Regular' }}>
              Add your own
            </Text>
          </Pressable>
        </View>

        {/* Bottom Spacer for fixed button */}
        <View className="h-32" />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View className="p-6 bg-background">
        <Button
          title="Start wasting time"
          onPress={handleStartTimer}
          variant="primary"
          disabled={!selectedActivity}
          icon={<ArrowRight size={20} color="white" />}
          className="w-full"
        />
      </View>
    </SafeAreaView>
  );
}

