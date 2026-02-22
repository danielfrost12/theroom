'use client';

import { useGameState } from '@/hooks/useGameState';
import { Onboarding } from '@/components/Onboarding';
import { CinematicOpening } from '@/components/CinematicOpening';
import { Game } from '@/components/Game';
import { Endgame } from '@/components/Endgame';

export default function Page() {
  const {
    screen, companyName, firstChoice, endData, hydrated,
    setScreen, setCompanyName, setFirstChoice, setEndData, reset,
  } = useGameState();

  if (!hydrated) {
    return <div style={{ background: '#0a0a0f', minHeight: '100vh' }} />;
  }

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>
      {screen === 'onboarding' && (
        <Onboarding onStart={() => setScreen('cinema')} />
      )}

      {screen === 'cinema' && (
        <CinematicOpening onComplete={(name, choice) => {
          setCompanyName(name);
          setFirstChoice(choice);
          setScreen('game');
        }} />
      )}

      {screen === 'game' && (
        <Game
          companyName={companyName}
          firstChoice={firstChoice}
          onEnd={(ending, arr, dims, decisions, weekLog) => {
            setEndData({ ending, arr, dims, decisions, weekLog });
            setScreen('endgame');
          }}
        />
      )}

      {screen === 'endgame' && endData && (
        <Endgame
          ending={endData.ending}
          arr={endData.arr}
          dims={endData.dims}
          decisions={endData.decisions}
          weekLog={endData.weekLog}
          companyName={companyName}
          onPlayAgain={reset}
        />
      )}
    </div>
  );
}
