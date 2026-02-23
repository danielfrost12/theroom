'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { Onboarding } from '@/components/Onboarding';
import { CinematicOpening } from '@/components/CinematicOpening';
import { Game } from '@/components/Game';
import { Endgame } from '@/components/Endgame';
import { TEMPO } from '@/lib/game/constants';
import { getPlayCount } from '@/lib/game/stats';

// Random company name generator for replays — single evocative words
const REPLAY_NAMES = [
  "Parallax", "Meridian", "Vesper", "Kindling", "Threshold",
  "Helix", "Canopy", "Forge", "Lattice", "Waypoint",
  "Ember", "Atlas", "Nimbus", "Prism", "Vertex",
  "Tidal", "Onyx", "Crucible", "Solace", "Cadence",
  "Aperture", "Basalt", "Cipher", "Drift", "Epoch",
  "Fulcrum", "Grain", "Harbor", "Index", "Junction",
];

function ScreenTransition({ children, screenKey }: { children: ReactNode; screenKey: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Hold on black briefly, then fade in — cinematic cut between acts
    const t = setTimeout(() => setVisible(true), TEMPO.holdBlack);
    return () => clearTimeout(t);
  }, [screenKey]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transition: `opacity ${TEMPO.fadeIn}ms ease`,
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

  // When the hook's screen changes externally (e.g. hydration), sync.
  // Guard against unrecoverable states — if we can't restore the screen, go back to start.
  useEffect(() => {
    if (screen === 'endgame' && !endData) {
      // endData isn't persisted — can't show endgame without it
      reset();
      return;
    }
    if (screen === 'game' && !companyName && hydrated) {
      // Mid-game reload with no company name — can't recover
      reset();
      return;
    }
    setActiveScreen(screen);
  }, [screen, endData, companyName, hydrated, reset]);

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
      }, TEMPO.fadeOut);
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
    return (
      <div style={{
        background: '#0a0a0f', minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 24, height: 2,
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 1,
          animation: 'pulse 2s ease infinite',
        }} />
      </div>
    );
  }

  return (
    <div style={{
      background: '#0a0a0f',
      minHeight: '100vh',
      opacity: fading ? 0 : 1,
      transition: `opacity ${TEMPO.fadeOut}ms ease`,
    }}>
      {activeScreen === 'onboarding' && (
        <ScreenTransition screenKey="onboarding">
          <Onboarding onStart={() => {
            // Returning players skip the cinematic — straight to Week 1
            if (getPlayCount() > 0) {
              transitionTo(() => {
                const name = REPLAY_NAMES[Math.floor(Math.random() * REPLAY_NAMES.length)];
                const choice = Math.random() < 0.5 ? 'Trust Marcus' : 'Trust yourself';
                setCompanyName(name);
                setFirstChoice(choice);
                setScreen('game');
              });
            } else {
              transitionTo(() => {
                setScreen('cinema');
              });
            }
          }} />
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
            onEnd={(ending, arr, dims, decisions, weekLog, pivotalMoments) => {
              transitionTo(() => {
                setEndData({ ending, arr, dims, decisions, weekLog, pivotalMoments });
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
            pivotalMoments={endData.pivotalMoments}
            companyName={companyName}
            onPlayAgain={() => transitionTo(reset)}
          />
        </ScreenTransition>
      )}
    </div>
  );
}
