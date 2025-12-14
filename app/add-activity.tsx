import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { availableIcons, iconMap } from '@/constants/iconMap';
import { saveCustomActivities, loadCustomActivities } from '@/lib/storage';
import { CustomActivity } from '@/lib/types';
import { useTheme } from '@/lib/ThemeContext';

export default function AddActivityScreen() {
  const router = useRouter();
  const { colors, iconColor } = useTheme();
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
          <View style={{ backgroundColor: colors.card }} className="rounded-3xl p-6 mx-6 w-full max-w-md">
              {/* Header */}
              <Text
                className="text-xl font-bold"
                style={{ fontFamily: 'Nunito_700Bold', color: colors.text }}>
                Add your own
              </Text>
              <Text
                className="text-base mt-1"
                style={{ fontFamily: 'Nunito_400Regular', color: colors.textLight }}>
                What pointless thing are you up to?
              </Text>

              {/* Text Input */}
              <TextInput
                value={activityName}
                onChangeText={setActivityName}
                placeholder="Name your activity..."
                placeholderTextColor={colors.textLight}
                maxLength={30}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                  marginTop: 24,
                  color: colors.text,
                  fontFamily: 'Nunito_400Regular',
                  fontSize: 16,
                  borderWidth: 2,
                  borderColor: isFocused ? colors.primary : 'transparent',
                }}
              />

              {/* Icon Picker */}
              <View className="mt-6">
                <Text
                  className="text-base font-semibold"
                  style={{ fontFamily: 'Nunito_600SemiBold', color: colors.text }}>
                  Pick an icon
                </Text>
                <View className="flex-row flex-wrap mt-3" style={{ gap: 12 }}>
                  {availableIcons.map(({ name, icon: Icon }) => {
                    const isSelected = selectedIconName === name;
                    return (
                      <Pressable
                        key={name}
                        onPress={() => setSelectedIconName(name)}
                        style={{
                          backgroundColor: colors.background,
                          borderRadius: 12,
                          padding: 12,
                          borderWidth: 2,
                          borderColor: isSelected ? colors.primary : 'transparent',
                          backgroundColor: isSelected ? colors.primary + '1A' : colors.background,
                        }}>
                        <Icon
                          size={24}
                          color={isSelected ? colors.primary : iconColor}
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

