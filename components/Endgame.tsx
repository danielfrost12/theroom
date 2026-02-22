'use client';

import { useEffect, useState } from 'react';
import { FONTS } from '@/lib/game/constants';
import { Ending, GameDimensions, Decision } from '@/lib/game/types';
import { getValuation } from '@/lib/game/engine';
import { getPlayerRank } from '@/lib/game/stats';
import { generateEndgameNarrative } from '@/lib/ai/narrative';
import { SceneBackground } from './SceneBackground';
import { CEOCard } from './CEOCard';

interface EndgameProps {
  ending: Ending;
  arr: number;
  dims: GameDimensions;
  decisions: Decision[];
  weekLog: string[];
  companyName: string;
  onPlayAgain: () => void;
}

export function Endgame({ ending, arr, dims, decisions, weekLog, companyName, onPlayAgain }: EndgameProps) {
  const [headline, setHeadline] = useState<string | null>(null);
  const [mirror, setMirror] = useState<string | null>(null);
  // dims needed for share image
  const valuation = getValuation(ending, arr);
  const rank = getPlayerRank();

  useEffect(() => {
    generateEndgameNarrative(ending, companyName, decisions, dims).then(result => {
      setHeadline(result.headline);
      setMirror(result.mirror);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!headline) {
    return (
      <SceneBackground sceneKey="rooftop">
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          minHeight: "100vh",
        }}>
          <div style={{
            fontFamily: FONTS.display,
            fontSize: 18,
            color: "rgba(255,255,255,0.4)",
            fontStyle: "italic",
            animation: "pulse 2s infinite",
          }}>
            Writing your story...
          </div>
        </div>
      </SceneBackground>
    );
  }

  return (
    <SceneBackground sceneKey={ending.type === "ipo" || ending.type === "acquired" ? "rooftop" : "apartment_night"}>
      <CEOCard
        ending={ending}
        companyName={companyName}
        valuation={valuation}
        weekLog={weekLog}
        rank={rank}
        headline={headline}
        mirror={mirror || "You played the only way you knew how."}
        dims={dims}
        onPlayAgain={onPlayAgain}
      />
    </SceneBackground>
  );
}
