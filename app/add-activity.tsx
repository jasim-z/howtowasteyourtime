import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { availableIcons, iconMap } from '@/constants/iconMap';
import { saveCustomActivities, loadCustomActivities } from '@/lib/storage';
import { CustomActivity } from '@/lib/types';

export default function AddActivityScreen() {
  const router = useRouter();
  const [activityName, setActivityName] = useState('');
  const [selectedIconName, setSelectedIconName] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleSave = async () => {
    if (!activityName.trim() || !selectedIconName) {
      return;
    }

    try {
      const existingActivities = await loadCustomActivities();
      const newActivity: CustomActivity = {
        id: `custom_${Date.now()}`,
        name: activityName.trim(),
        iconName: selectedIconName,
        isCustom: true,
      };

      const updatedActivities = [...existingActivities, newActivity];
      await saveCustomActivities(updatedActivities);
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to save activity. Please try again.');
      console.error('Error saving activity:', error);
    }
  };

  const handleDismiss = () => {
    router.back();
  };

  const canSave = activityName.trim().length > 0 && selectedIconName !== null;

  return (
    <Pressable
      style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onPress={handleDismiss}>
      <SafeAreaView className="flex-1 justify-center items-center">
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View className="bg-card rounded-3xl p-6 mx-6 w-full max-w-md">
              {/* Header */}
              <Text
                className="text-xl font-bold text-text"
                style={{ fontFamily: 'Nunito_700Bold' }}>
                Add your own
              </Text>
              <Text
                className="text-base text-textLight mt-1"
                style={{ fontFamily: 'Nunito_400Regular' }}>
                What pointless thing are you up to?
              </Text>

              {/* Text Input */}
              <TextInput
                value={activityName}
                onChangeText={setActivityName}
                placeholder="Name your activity..."
                placeholderTextColor="#8E8A9D"
                maxLength={30}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`bg-background rounded-2xl px-4 py-4 mt-6 text-text ${
                  isFocused ? 'border-2 border-primary' : 'border-2 border-transparent'
                }`}
                style={{
                  fontFamily: 'Nunito_400Regular',
                  fontSize: 16,
                }}
              />

              {/* Icon Picker */}
              <View className="mt-6">
                <Text
                  className="text-base font-semibold text-text"
                  style={{ fontFamily: 'Nunito_600SemiBold' }}>
                  Pick an icon
                </Text>
                <View className="flex-row flex-wrap mt-3" style={{ gap: 12 }}>
                  {availableIcons.map(({ name, icon: Icon }) => {
                    const isSelected = selectedIconName === name;
                    return (
                      <Pressable
                        key={name}
                        onPress={() => setSelectedIconName(name)}
                        className={`bg-background rounded-xl p-3 ${
                          isSelected
                            ? 'border-2 border-primary bg-primary/10'
                            : 'border-2 border-transparent'
                        }`}>
                        <Icon
                          size={24}
                          color={isSelected ? '#FF8A80' : '#5C5470'}
                        />
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Buttons */}
              <View className="flex-row gap-4 mt-8">
                <View className="flex-1">
                  <Button
                    title="Cancel"
                    onPress={handleDismiss}
                    variant="ghost"
                  />
                </View>
                <View className="flex-1">
                  <Button
                    title="Save"
                    onPress={handleSave}
                    variant="primary"
                    disabled={!canSave}
                  />
                </View>
              </View>
            </View>
          </Pressable>
        </SafeAreaView>
      </Pressable>
  );
}

