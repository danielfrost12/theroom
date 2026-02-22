'use client';

import { useEffect, useState } from 'react';
import { FONTS, COLORS } from '@/lib/game/constants';
import { Ending, GameDimensions, Decision } from '@/lib/game/types';
import { getValuation, detectArchetype } from '@/lib/game/engine';
import { getRank, savePlayRecord } from '@/lib/game/stats';
import { generateEndgameNarrative } from '@/lib/ai/narrative';
import { SceneBackground } from './SceneBackground';
import { CEOCard } from './CEOCard';

interface EndgameProps {
  ending: Ending;
  arr: number;
  dims: GameDimensions;
  decisions: Decision[];
  weekLog: string[];
  pivotalMoments?: string[];
  companyName: string;
  onPlayAgain: () => void;
}

export function Endgame({ ending, arr, dims, decisions, weekLog, pivotalMoments, companyName, onPlayAgain }: EndgameProps) {
  const [headline, setHeadline] = useState<string | null>(null);
  const [mirror, setMirror] = useState<string | null>(null);
  const valuation = getValuation(ending, arr);
  const { rank, total } = getRank(valuation);
  const archetype = detectArchetype(dims, decisions, weekLog.length);

  // Save play record to localStorage on mount
  useEffect(() => {
    savePlayRecord({
      ending: ending.type,
      endingLabel: ending.label,
      weeks: weekLog.length,
      valuation,
      archetype,
      date: Date.now(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          minHeight: "100dvh",
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

  const moments = pivotalMoments || [];

  return (
    <SceneBackground sceneKey={ending.type === "ipo" || ending.type === "acquired" ? "rooftop" : "apartment_night"}>
      <div style={{ overflowY: "auto", maxHeight: "100dvh" }}>
        <CEOCard
          ending={ending}
          companyName={companyName}
          valuation={valuation}
          weekLog={weekLog}
          rank={rank}
          totalRuns={total}
          headline={headline}
          mirror={mirror || "You played the only way you knew how."}
          dims={dims}
          archetype={archetype}
          pivotalMoments={moments}
          onPlayAgain={onPlayAgain}
        />

        {/* Story Recap — pivotal moments timeline */}
        {moments.length > 0 && (
          <div style={{
            maxWidth: 440,
            margin: "0 auto",
            padding: "0 20px 40px",
            animation: "fadeUp 0.8s ease 0.5s both",
          }}>
            <div style={{
              fontSize: 10,
              color: COLORS.muted,
              fontFamily: FONTS.mono,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: 16,
              textAlign: "center",
            }}>
              YOUR STORY
            </div>
            <div style={{ position: "relative", paddingLeft: 20 }}>
              {/* Vertical line */}
              <div style={{
                position: "absolute",
                left: 4,
                top: 4,
                bottom: 4,
                width: 1,
                background: "rgba(255,255,255,0.08)",
              }} />
              {moments.map((m, i) => (
                <div
                  key={i}
                  style={{
                    position: "relative",
                    marginBottom: i < moments.length - 1 ? 16 : 0,
                    opacity: 0,
                    animation: `fadeUp 0.5s ease ${0.8 + i * 0.2}s forwards`,
                  }}
                >
                  {/* Dot */}
                  <div style={{
                    position: "absolute",
                    left: -18,
                    top: 5,
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.2)",
                  }} />
                  <div style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: FONTS.body,
                    lineHeight: 1.5,
                  }}>
                    {m}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SceneBackground>
  );
}
