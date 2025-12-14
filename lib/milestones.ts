import { WasteStats } from './types';

export interface Milestone {
  id: string;
  message: string;
  emoji: string;
}

export function checkMilestones(stats: WasteStats): Milestone | null {
  // First session ever
  if (stats.sessionsAllTime === 1) {
    return {
      id: 'first_session',
      message: 'First waste complete!',
      emoji: '🎉',
    };
  }

  // 10 minutes wasted today
  if (stats.totalSecondsToday >= 600 && stats.totalSecondsToday < 900) {
    return {
      id: '10_min_today',
      message: '10 minutes wasted today!',
      emoji: '⭐',
    };
  }

  // 1 hour all time
  if (stats.totalSecondsAllTime >= 3600 && stats.totalSecondsAllTime < 9000) {
    return {
      id: '1_hour_alltime',
      message: '1 hour wasted lifetime!',
      emoji: '⭐',
    };
  }

  // 5 hours all time
  if (stats.totalSecondsAllTime >= 18000 && stats.totalSecondsAllTime < 21600) {
    return {
      id: '5_hours_alltime',
      message: 'Procrastination Pro: 5 hours!',
      emoji: '🏆',
    };
  }

  // 10 hours all time
  if (stats.totalSecondsAllTime >= 36000 && stats.totalSecondsAllTime < 39600) {
    return {
      id: '10_hours_alltime',
      message: 'Master of Nothing: 10 hours!',
      emoji: '👑',
    };
  }

  // 25 sessions all time
  if (stats.sessionsAllTime === 25) {
    return {
      id: '25_sessions',
      message: '25 sessions of pure nothing!',
      emoji: '🌟',
    };
  }

  return null;
}

