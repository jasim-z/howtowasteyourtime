import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { ChevronLeft, ArrowRight, Plus } from 'lucide-react-native';
import { ActivityCard } from '@/components/ActivityCard';
import { Button } from '@/components/Button';
import { defaultActivities } from '@/constants/activities';
import { iconMap } from '@/constants/iconMap';
import { loadCustomActivities, saveCustomActivities } from '@/lib/storage';
import { Activity, CustomActivity } from '@/lib/types';

export default function ActivitiesScreen() {
  const router = useRouter();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [allActivities, setAllActivities] = useState<Activity[]>(defaultActivities);

  const loadActivities = useCallback(async () => {
    try {
      const customActivitiesData = await loadCustomActivities();
      const customActivities: Activity[] = customActivitiesData.map((custom) => {
        const Icon = iconMap[custom.iconName];
        if (!Icon) {
          // Fallback to first available icon if mapping fails
          return {
            id: custom.id,
            name: custom.name,
            icon: iconMap.Coffee,
            isCustom: true,
          };
        }
        return {
          id: custom.id,
          name: custom.name,
          icon: Icon,
          isCustom: true,
        };
      });

      setAllActivities([...defaultActivities, ...customActivities]);
    } catch (error) {
      console.error('Error loading activities:', error);
      setAllActivities(defaultActivities);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadActivities();
    }, [loadActivities])
  );

  const handleActivityPress = (activity: Activity) => {
    setSelectedActivity(activity);
  };

  const handleLongPress = async (activity: Activity) => {
    if (!activity.isCustom) {
      return;
    }

    Alert.alert(
      'Delete Activity',
      'Delete this activity?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const customActivities = await loadCustomActivities();
              const updated = customActivities.filter((a) => a.id !== activity.id);
              await saveCustomActivities(updated);
              await loadActivities();
              if (selectedActivity?.id === activity.id) {
                setSelectedActivity(null);
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete activity.');
              console.error('Error deleting activity:', error);
            }
          },
        },
      ]
    );
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
          {allActivities.map((activity) => {
            const Icon = activity.icon;
            return (
              <ActivityCard
                key={activity.id}
                icon={Icon}
                name={activity.name}
                selected={selectedActivity?.id === activity.id}
                onPress={() => handleActivityPress(activity)}
                onLongPress={() => handleLongPress(activity)}
                isCustom={activity.isCustom}
              />
            );
          })}

          {/* Add Custom Button */}
          <Pressable
            onPress={() => router.push('/add-activity')}
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

