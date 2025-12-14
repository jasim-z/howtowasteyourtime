import AsyncStorage from '@react-native-async-storage/async-storage';
import { WasteStats } from './types';

const STATS_KEY = 'waste_stats';

const defaultStats: WasteStats = {
  totalSecondsAllTime: 0,
  totalSecondsToday: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  sessionsToday: 0,
  sessionsAllTime: 0,
};

export async function loadStats(): Promise<WasteStats> {
  try {
    const jsonValue = await AsyncStorage.getItem(STATS_KEY);
    if (jsonValue == null) {
      return defaultStats;
    }
    const stats = JSON.parse(jsonValue) as WasteStats;
    return resetDailyStatsIfNeeded(stats);
  } catch (error) {
    console.error('Error loading stats:', error);
    return defaultStats;
  }
}

export async function saveStats(stats: WasteStats): Promise<void> {
  try {
    const jsonValue = JSON.stringify(stats);
    await AsyncStorage.setItem(STATS_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving stats:', error);
    throw error;
  }
}

export function resetDailyStatsIfNeeded(stats: WasteStats): WasteStats {
  const today = new Date().toISOString().split('T')[0];
  
  if (stats.lastActiveDate !== today) {
    return {
      ...stats,
      totalSecondsToday: 0,
      sessionsToday: 0,
      lastActiveDate: today,
    };
  }
  
  return stats;
}

export async function addCompletedSession(
  activityName: string,
  duration: number
): Promise<WasteStats> {
  const stats = await loadStats();
  const today = new Date().toISOString().split('T')[0];
  
  const updatedStats: WasteStats = {
    totalSecondsAllTime: stats.totalSecondsAllTime + duration,
    totalSecondsToday: stats.lastActiveDate === today 
      ? stats.totalSecondsToday + duration 
      : duration,
    lastActiveDate: today,
    sessionsToday: stats.lastActiveDate === today 
      ? stats.sessionsToday + 1 
      : 1,
    sessionsAllTime: stats.sessionsAllTime + 1,
  };
  
  await saveStats(updatedStats);
  return updatedStats;
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0 && minutes > 0) {
    return `${hours} hr ${minutes} min`;
  } else if (hours > 0) {
    return `${hours} hr`;
  } else if (minutes > 0) {
    return `${minutes} min`;
  } else {
    return '0 min';
  }
}

