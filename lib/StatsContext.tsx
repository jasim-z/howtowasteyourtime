import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WasteStats } from './types';
import { loadStats, addCompletedSession as saveSession } from './statsStorage';

interface StatsContextType {
  stats: WasteStats | null;
  refreshStats: () => Promise<void>;
  addSession: (activityName: string, duration: number) => Promise<void>;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<WasteStats | null>(null);

  const refreshStats = useCallback(async () => {
    const loadedStats = await loadStats();
    setStats(loadedStats);
  }, []);

  const addSession = useCallback(async (activityName: string, duration: number) => {
    const updatedStats = await saveSession(activityName, duration);
    setStats(updatedStats);
  }, []);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  return (
    <StatsContext.Provider value={{ stats, refreshStats, addSession }}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
}

