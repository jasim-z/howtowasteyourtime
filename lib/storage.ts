import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomActivity } from './types';

const CUSTOM_ACTIVITIES_KEY = 'custom_activities';

export async function saveCustomActivities(activities: CustomActivity[]): Promise<void> {
  try {
    const jsonValue = JSON.stringify(activities);
    await AsyncStorage.setItem(CUSTOM_ACTIVITIES_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving custom activities:', error);
    throw error;
  }
}

export async function loadCustomActivities(): Promise<CustomActivity[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(CUSTOM_ACTIVITIES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error loading custom activities:', error);
    return [];
  }
}

