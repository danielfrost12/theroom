'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameState, EndData } from '@/lib/game/types';

const STORAGE_KEY = 'theroom-game-state';

const INITIAL_STATE: GameState = {
  screen: 'onboarding',
  companyName: '',
  firstChoice: '',
  week: 1,
  cash: 2500,
  arr: 0,
  dims: { company: 60, relationships: 70, energy: 80, integrity: 80 },
  decisions: [],
  weekLog: [],
  usedTensionIndices: [],
  pivotalMoments: [],
};

function loadState(): GameState | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return null;
}

function saveState(state: GameState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

export function useGameState() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [endData, setEndData] = useState<EndData | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = loadState();
    if (saved) setState(saved);
    setHydrated(true);
  }, []);

  // Persist on every state change (after hydration)
  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const setScreen = useCallback((screen: GameState['screen']) => {
    setState(prev => ({ ...prev, screen }));
  }, []);

  const setCompanyName = useCallback((companyName: string) => {
    setState(prev => ({ ...prev, companyName }));
  }, []);

  const setFirstChoice = useCallback((firstChoice: string) => {
    setState(prev => ({ ...prev, firstChoice }));
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
    setEndData(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return {
    ...state,
    endData,
    hydrated,
    setScreen,
    setCompanyName,
    setFirstChoice,
    setEndData,
    reset,
    setState,
  };
}
