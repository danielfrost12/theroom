'use client';

import { useEffect, useState } from 'react';
import { FONTS, COLORS } from '@/lib/game/constants';
import { Ending, GameDimensions, Decision } from '@/lib/game/types';
import { getValuation, detectArchetype } from '@/lib/game/engine';
import { getRank, savePlayRecord, getPercentile, getNearMiss } from '@/lib/game/stats';
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

// The one unresolved question that makes you want to play again
function getHauntingQuestion(ending: Ending, decisions: Decision[], dims: GameDimensions): string {
  // Find a pivotal decision — one where the unchosen path might have changed everything
  const significantDecisions = decisions.filter(d => {
    // Look for decisions where the choice text implies a clear fork
    return d.choice.length > 0;
  });

  // Find the decision closest to the turning point — the moment things started going wrong (or right)
  const dimEntries = [
    { key: 'company', val: dims.company },
    { key: 'relationships', val: dims.relationships },
    { key: 'energy', val: dims.energy },
    { key: 'integrity', val: dims.integrity },
  ];
  const weakest = dimEntries.reduce((a, b) => a.val < b.val ? a : b);

  // Try to find a decision from the middle of the game (most impactful period)
  const midgameDecisions = significantDecisions.filter(d => d.week >= 8 && d.week <= 18);
  const pivotDecision = midgameDecisions.length > 0
    ? midgameDecisions[Math.floor(midgameDecisions.length / 2)]
    : significantDecisions[Math.floor(significantDecisions.length * 0.6)];

  if (!pivotDecision) {
    // Fallback based on ending type
    switch (ending.type) {
      case 'burnout': return "What if you'd stopped when your body first told you to?";
      case 'bankrupt': return "What if you'd taken that meeting you skipped in week 8?";
      case 'ipo': return "Was there a version of this where nobody had to get hurt?";
      case 'acquired': return "Would it have been worth more if you'd waited?";
      default: return "What if you'd made one different choice?";
    }
  }

  // Build the question from the actual unchosen path
  const weekLabel = `week ${pivotDecision.week}`;
  const choice = pivotDecision.choice;

  // Craft the question based on ending type + what they chose
  switch (ending.type) {
    case 'burnout':
    case 'bankrupt':
      return `What would have happened if you hadn't chosen "${choice}" in ${weekLabel}?`;
    case 'ipo':
    case 'acquired':
      return `Would you have gotten here without choosing "${choice}" in ${weekLabel}?`;
    case 'disgraced':
      return `Was there a version where you said no in ${weekLabel}?`;
    case 'board_removed':
      return `What if you'd played it differently in ${weekLabel}?`;
    default:
      return `In ${weekLabel}, you chose "${choice}." What if you hadn't?`;
  }
}

// The shareable personal story — one sentence that captures YOUR run
function getPersonalStorySentence(
  companyName: string,
  ending: Ending,
  weekLog: string[],
  dims: GameDimensions,
): string {
  const weeks = weekLog.length;
  const dimEntries = [
    { key: 'company', label: 'the product', val: dims.company },
    { key: 'relationships', label: 'my people', val: dims.relationships },
    { key: 'energy', label: 'myself', val: dims.energy },
    { key: 'integrity', label: 'the truth', val: dims.integrity },
  ];
  const highest = dimEntries.reduce((a, b) => a.val > b.val ? a : b);
  const lowest = dimEntries.reduce((a, b) => a.val < b.val ? a : b);

  switch (ending.type) {
    case 'ipo':
      return `I built ${companyName} and took it public in ${weeks} weeks. I chose ${highest.label} over ${lowest.label}. It cost me.`;
    case 'acquired':
      return `I built ${companyName}. They bought it in week ${weeks}. I protected ${highest.label} and lost ${lowest.label}.`;
    case 'burnout':
      return `I built ${companyName}. I burned out in ${weeks} weeks because I couldn't stop choosing ${highest.label}.`;
    case 'bankrupt':
      return `I built ${companyName}. It went bankrupt in ${weeks} weeks. ${highest.label === 'the product' ? 'The product was great.' : 'I tried.'} Nobody cared.`;
    case 'disgraced':
      return `I built ${companyName}. I lost everything in ${weeks} weeks. One compromise too many.`;
    case 'board_removed':
      return `I built ${companyName}. The board removed me in week ${weeks}. I chose ${highest.label}. They chose the numbers.`;
    case 'forced_sale':
      return `I built ${companyName}. I had to sell in week ${weeks}. ${lowest.label === 'myself' ? 'I had nothing left.' : 'It wasn\'t my choice.'}`;
    default:
      return `I built ${companyName}. ${weeks} weeks. I chose ${highest.label} over ${lowest.label}. That's how it ended.`;
  }
}

export function Endgame({ ending, arr, dims, decisions, weekLog, pivotalMoments, companyName, onPlayAgain }: EndgameProps) {
  const [headline, setHeadline] = useState<string | null>(null);
  const [mirror, setMirror] = useState<string | null>(null);
  const [showCard, setShowCard] = useState(false);
  const valuation = getValuation(ending, arr);
  const { rank, total } = getRank(valuation);
  const archetype = detectArchetype(dims, decisions, weekLog.length);
  const hauntingQuestion = getHauntingQuestion(ending, decisions, dims);
  const storySentence = getPersonalStorySentence(companyName, ending, weekLog, dims);
  const percentile = getPercentile(valuation);
  const nearMiss = getNearMiss(ending.type, dims, arr, weekLog.length);

  // Save play record to localStorage on mount — includes ghost data for future playthroughs
  useEffect(() => {
    const dimEntries = [
      { key: 'company', val: dims.company },
      { key: 'relationships', val: dims.relationships },
      { key: 'energy', val: dims.energy },
      { key: 'integrity', val: dims.integrity },
    ];
    const weakest = dimEntries.reduce((a, b) => a.val < b.val ? a : b);

    savePlayRecord({
      ending: ending.type,
      endingLabel: ending.label,
      weeks: weekLog.length,
      valuation,
      archetype,
      date: Date.now(),
      keyChoices: decisions.slice(-5).map(d => d.choice),
      weakestDim: weakest.key,
      companyName,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    generateEndgameNarrative(ending, companyName, decisions, dims).then(result => {
      setHeadline(result.headline);
      setMirror(result.mirror);
      // Jobs: hold the headline alone for 3 seconds, then reveal the card
      setTimeout(() => setShowCard(true), 3000);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Loading state — waiting for AI to generate narrative
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

  // Phase 1: Just the headline — one sentence and silence (Jobs)
  if (!showCard) {
    return (
      <SceneBackground sceneKey={ending.type === "ipo" || ending.type === "acquired" ? "rooftop" : "apartment_night"}>
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          minHeight: "100dvh",
          padding: "0 32px",
        }}>
          <div style={{
            fontFamily: FONTS.display,
            fontSize: "clamp(18px, 4.5vw, 24px)",
            color: "rgba(255,238,220,0.7)",
            fontStyle: "italic",
            fontWeight: 300,
            lineHeight: 1.7,
            textAlign: "center",
            maxWidth: 380,
            animation: "fadeUp 1.5s ease",
          }}>
            &ldquo;{headline}&rdquo;
          </div>
        </div>
      </SceneBackground>
    );
  }

  // Phase 2: The full endgame — card, story, haunting question
  const moments = pivotalMoments || [];

  return (
    <SceneBackground sceneKey={ending.type === "ipo" || ending.type === "acquired" ? "rooftop" : "apartment_night"}>
      <div style={{ overflowY: "auto", maxHeight: "100dvh" }}>
        <div style={{
          opacity: 0,
          animation: "fadeUp 1.2s ease 0.2s forwards",
        }}>
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
            percentile={percentile}
            nearMiss={nearMiss}
            decisions={decisions}
            onPlayAgain={onPlayAgain}
          />
        </div>

        {/* The haunting question — the thing that stays with you (Jobs) */}
        <div style={{
          maxWidth: 440,
          margin: "0 auto",
          padding: "8px 28px 0",
          opacity: 0,
          animation: "fadeUp 0.8s ease 1.5s forwards",
        }}>
          <div style={{
            fontFamily: FONTS.display,
            fontSize: 14,
            color: "rgba(255,238,210,0.35)",
            fontStyle: "italic",
            lineHeight: 1.6,
            textAlign: "center",
          }}>
            {hauntingQuestion}
          </div>
        </div>

        {/* Personal story sentence — the thing they share (Chesky) */}
        <div style={{
          maxWidth: 440,
          margin: "0 auto",
          padding: "20px 28px 0",
          opacity: 0,
          animation: "fadeUp 0.6s ease 2.2s forwards",
        }}>
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12,
            padding: "16px 20px",
            textAlign: "center",
          }}>
            <div style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.45)",
              fontFamily: FONTS.body,
              lineHeight: 1.6,
              marginBottom: 8,
            }}>
              {storySentence}
            </div>
            <div style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.2)",
              fontFamily: FONTS.mono,
              letterSpacing: "1px",
            }}>
              behindtheroom.com
            </div>
          </div>
        </div>

        {/* Story Recap — pivotal moments timeline */}
        {moments.length > 0 && (
          <div style={{
            maxWidth: 440,
            margin: "0 auto",
            padding: "24px 20px 40px",
            opacity: 0,
            animation: "fadeUp 0.8s ease 2.8s forwards",
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
                    animation: `fadeUp 0.5s ease ${3.0 + i * 0.2}s forwards`,
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
