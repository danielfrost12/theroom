'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { Onboarding } from '@/components/Onboarding';
import { CinematicOpening } from '@/components/CinematicOpening';
import { Game } from '@/components/Game';
import { Endgame } from '@/components/Endgame';
import { LofiPlayer } from '@/components/LofiPlayer';

function ScreenTransition({ children, screenKey }: { children: ReactNode; screenKey: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Small delay then fade in
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, [screenKey]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.8s ease',
        position: 'fixed',
        inset: 0,
      }}
    >
      {children}
    </div>
  );
}

export default function Page() {
  const {
    screen, companyName, firstChoice, endData, hydrated,
    setScreen, setCompanyName, setFirstChoice, setEndData, reset,
  } = useGameState();

  const [activeScreen, setActiveScreen] = useState(screen);
  const [fading, setFading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // When the hook's screen changes externally (e.g. hydration), sync
  useEffect(() => {
    setActiveScreen(screen);
  }, [screen]);

  const transitionTo = (action: () => void) => {
    setFading(true);
    setPendingAction(() => action);
  };

  useEffect(() => {
    if (fading && pendingAction) {
      const t = setTimeout(() => {
        pendingAction();
        setFading(false);
        setPendingAction(null);
      }, 600); // fade out duration
      return () => clearTimeout(t);
    }
  }, [fading, pendingAction]);

  // Sync activeScreen after state updates
  useEffect(() => {
    if (!fading) {
      setActiveScreen(screen);
    }
  }, [screen, fading]);

  if (!hydrated) {
    return <div style={{ background: '#0a0a0f', minHeight: '100vh' }} />;
  }

  return (
    <div style={{
      background: '#0a0a0f',
      minHeight: '100vh',
      opacity: fading ? 0 : 1,
      transition: 'opacity 0.6s ease',
    }}>
      {activeScreen === 'onboarding' && (
        <ScreenTransition screenKey="onboarding">
          <Onboarding onStart={() => transitionTo(() => setScreen('cinema'))} />
        </ScreenTransition>
      )}

      {activeScreen === 'cinema' && (
        <ScreenTransition screenKey="cinema">
          <CinematicOpening onComplete={(name, choice) => {
            transitionTo(() => {
              setCompanyName(name);
              setFirstChoice(choice);
              setScreen('game');
            });
          }} />
        </ScreenTransition>
      )}

      {activeScreen === 'game' && (
        <ScreenTransition screenKey="game">
          <Game
            companyName={companyName}
            firstChoice={firstChoice}
            onEnd={(ending, arr, dims, decisions, weekLog) => {
              transitionTo(() => {
                setEndData({ ending, arr, dims, decisions, weekLog });
                setScreen('endgame');
              });
            }}
          />
        </ScreenTransition>
      )}

      {activeScreen === 'endgame' && endData && (
        <ScreenTransition screenKey="endgame">
          <Endgame
            ending={endData.ending}
            arr={endData.arr}
            dims={endData.dims}
            decisions={endData.decisions}
            weekLog={endData.weekLog}
            companyName={companyName}
            onPlayAgain={() => transitionTo(reset)}
          />
        </ScreenTransition>
      )}

      <LofiPlayer />
    </div>
  );
}
