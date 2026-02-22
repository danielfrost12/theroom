'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { FONTS } from '@/lib/game/constants';
import { GameDimensions, Ending, Decision, IndexedTension } from '@/lib/game/types';
import { getSceneForState, getBreathingMoment, getTension, checkEnding, checkSurpriseEvent, checkMilestone, getTensionStakes, type SurpriseEvent, type Milestone, type TensionStakes } from '@/lib/game/engine';
import { generateNarrative } from '@/lib/ai/narrative';
import { SceneBackground } from './SceneBackground';
import { DimBar } from './DimBar';

interface GameProps {
  companyName: string;
  firstChoice: string;
  onEnd: (ending: Ending, arr: number, dims: GameDimensions, decisions: Decision[], weekLog: string[]) => void;
}

export function Game({ companyName, firstChoice, onEnd }: GameProps) {
  const [week, setWeek] = useState(1);
  const [cash, setCash] = useState(2500);
  const [arr, setArr] = useState(0);
  const [dims, setDims] = useState<GameDimensions>(() => {
    // Start slightly underwater. Day one of a startup is already hard.
    // Opening choice flavors the run — it shouldn't cripple any dimension.
    const base = { company: 50, relationships: 55, energy: 65, integrity: 70 };
    if (firstChoice === "Trust Marcus") {
      base.company -= 5; base.relationships += 5; base.integrity += 3;
    } else if (firstChoice === "Trust yourself") {
      base.company += 5; base.relationships -= 8; base.energy -= 3;
    }
    return base;
  });
  const [tension, setTension] = useState<IndexedTension | null>(null);
  const [usedTensions, setUsedTensions] = useState<Set<number>>(new Set());
  const [narrative, setNarrative] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [breathingMoment, setBreathingMoment] = useState<string | null>(null);
  const [showBreathing, setShowBreathing] = useState(false);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [weekLog, setWeekLog] = useState<string[]>([]);
  const [showCustom, setShowCustom] = useState(false);
  const [customText, setCustomText] = useState("");
  const [compressing, setCompressing] = useState(false);
  const [compressWeeks, setCompressWeeks] = useState(0);
  const [compressMoment, setCompressMoment] = useState<string>("");
  const [waitingForTap, setWaitingForTap] = useState(false);
  const [foreshadow, setForeshadow] = useState<string | null>(null);
  const [isConsequence, setIsConsequence] = useState(false);
  const [stakes, setStakes] = useState<TensionStakes>('medium');
  // Surprise events — the world moves without you
  const [surpriseEvent, setSurpriseEvent] = useState<SurpriseEvent | null>(null);
  const [usedEvents, setUsedEvents] = useState<Set<string>>(new Set());
  // Milestones — positive feedback
  const [milestone, setMilestone] = useState<Milestone | null>(null);
  const [usedMilestones, setUsedMilestones] = useState<Set<string>>(new Set());
  // Delay before choices appear (varies by stakes)
  const [showChoices, setShowChoices] = useState(true);
  // Store the continuation action so tap-to-continue can trigger it
  const pendingContinueRef = useRef<(() => void) | null>(null);

  // Ref to track and cleanup all timeouts
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const usedTensionsRef = useRef<Set<number>>(new Set());

  // Keep ref in sync with state
  useEffect(() => {
    usedTensionsRef.current = usedTensions;
  }, [usedTensions]);

  // Cleanup all timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const addTimeout = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
    return id;
  };

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  // Get initial tension
  useEffect(() => {
    const pastChoices = decisions.map(d => d.choice);
    const t = getTension(week, usedTensions, dims, cash, pastChoices);
    setTension(t);
    setIsConsequence(!!t.requires);
    setStakes(getTensionStakes(t, dims));
    setUsedTensions(prev => new Set([...prev, t.idx]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sceneKey = getSceneForState(dims, week);

  // Live mood — the room breathes with the state of the company
  const liveMood = useMemo(() => ({
    energy: dims.energy,
    tension: Math.max(
      100 - Math.min(dims.company, dims.relationships, dims.energy, dims.integrity),
      cash < 500 ? 70 : 0,
      stakes === 'critical' ? 80 : stakes === 'high' ? 60 : 30,
    ),
    relationships: dims.relationships,
    integrity: dims.integrity,
  }), [dims, cash, stakes]);

  const isDesperate = dims.company < 35 || dims.energy < 30 || dims.relationships < 30 || cash < 400;

  const handleChoice = async (choice: string, effects: Partial<GameDimensions>, isCustom = false) => {
    // Clear any pending timeouts from previous choice
    clearAllTimeouts();

    setLoading(true);
    setNarrative(null);
    setForeshadow(null);
    setShowBreathing(true);
    setBreathingMoment(getBreathingMoment(dims));

    // Check for foreshadowing on this choice
    if (tension) {
      const isLeft = choice === tension.left;
      const shadow = isLeft ? tension.leftForeshadow : tension.rightForeshadow;
      if (shadow) setForeshadow(shadow);
    }

    // Apply effects with momentum dampening:
    // When a dimension is already low, negative effects are softened.
    // This prevents "two bad draws and you're dead" while keeping tension when things are good.
    const newDims = { ...dims };
    if (!isCustom) {
      (Object.keys(effects) as (keyof GameDimensions)[]).forEach(k => {
        let delta = effects[k] || 0;
        if (delta < 0 && newDims[k] < 30) {
          // Below 30: halve the damage. You're already hurting — diminishing returns on punishment.
          delta = Math.ceil(delta * 0.5);
        } else if (delta < 0 && newDims[k] < 45) {
          // Below 45: soften by 30%. The spiral slows.
          delta = Math.ceil(delta * 0.7);
        }
        newDims[k] = Math.max(0, Math.min(100, newDims[k] + delta));
      });
    } else {
      // Desperation is volatile. Hail marys either save you or destroy you.
      const swing = Math.random();
      if (swing > 0.6) {
        // It worked — one thing improves dramatically, but you burned everything else
        const lucky = ['company', 'relationships', 'energy', 'integrity'][Math.floor(Math.random() * 4)] as keyof GameDimensions;
        newDims[lucky] = Math.min(100, newDims[lucky] + 15 + Math.floor(Math.random() * 10));
        (Object.keys(newDims) as (keyof GameDimensions)[]).forEach(k => {
          if (k !== lucky) newDims[k] = Math.max(0, newDims[k] - 8 - Math.floor(Math.random() * 5));
        });
      } else {
        // It didn't work. Everything gets worse.
        (Object.keys(newDims) as (keyof GameDimensions)[]).forEach(k => {
          newDims[k] = Math.max(0, newDims[k] - 5 - Math.floor(Math.random() * 8));
        });
      }
    }

    // ARR: growth is earned. Company dimension is the engine.
    // Even mediocre companies grow a little. Great companies grow fast. Dying companies shrink.
    let arrDelta: number;
    if (newDims.company >= 55) {
      arrDelta = Math.floor(Math.random() * 6) + 4; // +4 to +9: strong growth
    } else if (newDims.company >= 35) {
      arrDelta = Math.floor(Math.random() * 4) + 1; // +1 to +4: slow growth
    } else if (newDims.company >= 15) {
      arrDelta = Math.floor(Math.random() * 3); // 0 to +2: stalling
    } else {
      arrDelta = -(Math.floor(Math.random() * 3) + 1); // -1 to -3: shrinking
    }
    const newArr = Math.max(0, arr + arrDelta);

    // Cash: oxygen. Burns every week. Revenue offsets burn when ARR is real.
    const weeklyBurn = 45 + Math.floor(arr * 0.8); // burn scales slower
    const weeklyRevenue = Math.floor(newArr * 2.8); // revenue converts better
    const newCash = Math.max(0, cash - weeklyBurn + weeklyRevenue);
    const newWeek = week + 1;

    setDims(newDims);
    setArr(newArr);
    setCash(newCash);

    const decision: Decision = { week, context: tension?.context || "Custom move", choice, dims: { ...newDims } };
    const newDecisions = [...decisions, decision];
    setDecisions(newDecisions);

    // Log week color
    const avg = (newDims.company + newDims.relationships + newDims.energy + newDims.integrity) / 4;
    let weekColor: string;
    if (avg > 65) weekColor = "🟩";
    else if (avg > 45) weekColor = "🟨";
    else weekColor = "🟥";
    if (newDims.relationships < 25 && dims.relationships >= 25) weekColor = "💀";
    if (newArr > arr + 15) weekColor = "🏆";
    const newWeekLog = [...weekLog, weekColor];
    setWeekLog(newWeekLog);

    // Generate narrative
    const narrativeText = await generateNarrative(
      tension?.context || customText,
      choice,
      newDims,
      week,
      companyName
    );

    setNarrative(narrativeText);
    setShowBreathing(false);
    setLoading(false);
    setWeek(newWeek);

    // Check ending
    const ending = checkEnding({ week: newWeek, cash: newCash, arr: newArr, dims: newDims });
    if (ending) {
      addTimeout(() => onEnd(ending, newArr, newDims, newDecisions, newWeekLog), 4000);
      return;
    }

    // --- CONTINUATION LOGIC ---
    // After narrative, player taps to advance. What happens next varies:
    // surprise event, milestone, time compression, or straight to next tension.

    const advanceToNextTension = (w: number, d: GameDimensions, c: number, a: number, decs: Decision[], wLog: string[]) => {
      // Check for milestone first — positive moments get priority
      const ms = checkMilestone({ week: w, dims: d, arr: a, cash: c }, usedMilestones);
      if (ms) {
        setMilestone(ms);
        setUsedMilestones(prev => new Set([...prev, ms.once]));
        setNarrative(null);
        // After milestone, show next tension
        addTimeout(() => {
          setMilestone(null);
          const t = getTension(w, usedTensionsRef.current, d, c, decs.map(dd => dd.choice));
          setTension(t);
          setIsConsequence(!!t.requires);
          setStakes(getTensionStakes(t, d));
          setUsedTensions(prev => new Set([...prev, t.idx]));
          setShowCustom(false);
          setCustomText("");
          // Delay choices based on stakes
          setShowChoices(false);
          const choiceDelay = t.requires ? 2500 : getTensionStakes(t, d) === 'high' ? 1800 : getTensionStakes(t, d) === 'critical' ? 2500 : 800;
          addTimeout(() => setShowChoices(true), choiceDelay);
        }, 3500);
        return;
      }

      // Check for surprise event
      const surprise = checkSurpriseEvent({ week: w, dims: d, cash: c, arr: a, pastChoices: decs.map(dd => dd.choice) }, usedEvents);
      if (surprise) {
        setSurpriseEvent(surprise);
        if (surprise.once) setUsedEvents(prev => new Set([...prev, surprise.once!]));
        setNarrative(null);

        // Apply surprise effects after showing it
        addTimeout(() => {
          const sDims = { ...d };
          (Object.keys(surprise.effects) as (keyof GameDimensions)[]).forEach(k => {
            sDims[k] = Math.max(0, Math.min(100, sDims[k] + (surprise.effects[k] || 0)));
          });
          const sArr = Math.max(0, a + (surprise.arrEffect || 0));
          const sCash = Math.max(0, c + (surprise.cashEffect || 0));
          setDims(sDims);
          setArr(sArr);
          setCash(sCash);

          // Log the week
          const sAvg = (sDims.company + sDims.relationships + sDims.energy + sDims.integrity) / 4;
          const sColor = sAvg > 65 ? "🟩" : sAvg > 45 ? "🟨" : "🟥";
          const sWeekLog = [...wLog, sColor];
          setWeekLog(sWeekLog);
          setWeek(w + 1);

          // Check ending
          const sEnding = checkEnding({ week: w + 1, cash: sCash, arr: sArr, dims: sDims });
          if (sEnding) {
            addTimeout(() => onEnd(sEnding, sArr, sDims, decs, sWeekLog), 2000);
            return;
          }

          // After surprise, next tension
          addTimeout(() => {
            setSurpriseEvent(null);
            const t = getTension(w + 1, usedTensionsRef.current, sDims, sCash, decs.map(dd => dd.choice));
            setTension(t);
            setIsConsequence(!!t.requires);
            setStakes(getTensionStakes(t, sDims));
            setUsedTensions(prev => new Set([...prev, t.idx]));
            setShowCustom(false);
            setCustomText("");
            setShowChoices(false);
            addTimeout(() => setShowChoices(true), 800);
          }, 2500);
        }, 3000);
        return;
      }

      // Normal: straight to next tension
      const t = getTension(w, usedTensionsRef.current, d, c, decs.map(dd => dd.choice));
      setTension(t);
      setIsConsequence(!!t.requires);
      setStakes(getTensionStakes(t, d));
      setUsedTensions(prev => new Set([...prev, t.idx]));
      setNarrative(null);
      setShowCustom(false);
      setCustomText("");
      // Delay choices based on stakes — high-stakes questions let the context sink in
      setShowChoices(false);
      const choiceDelay = t.requires ? 2500 : getTensionStakes(t, d) === 'high' ? 1800 : getTensionStakes(t, d) === 'critical' ? 2500 : 800;
      addTimeout(() => setShowChoices(true), choiceDelay);
    };

    const shouldCompress = Math.random() > 0.55 && newWeek < 48;

    if (shouldCompress) {
      const skipWeeks = Math.min(1 + Math.floor(Math.random() * 3), 52 - newWeek);
      if (skipWeeks > 0) {
        pendingContinueRef.current = () => {
          setWaitingForTap(false);
          setNarrative(null);
          setCompressing(true);
          setCompressWeeks(skipWeeks);
          setCompressMoment(getBreathingMoment(newDims));
          addTimeout(() => {
            const burnPerWeek = 50 + Math.floor(newArr * 1.2);
            const revPerWeek = Math.floor(newArr * 2.5);
            const compressedCash = Math.max(0, newCash + skipWeeks * (revPerWeek - burnPerWeek));
            const compressedArr = Math.max(0, newArr + (newDims.company >= 50 ? Math.floor(Math.random() * skipWeeks * 2) : -Math.floor(Math.random() * skipWeeks)));
            const compressedWeek = newWeek + skipWeeks;

            const driftDims = { ...newDims };
            driftDims.relationships = Math.max(0, driftDims.relationships - skipWeeks);
            driftDims.energy = Math.max(0, driftDims.energy - skipWeeks);
            driftDims.company = Math.max(0, driftDims.company - Math.ceil(skipWeeks * 0.5));
            setDims(driftDims);

            setWeek(compressedWeek);
            setCash(compressedCash);
            setArr(compressedArr);
            const compressedAvg = (driftDims.company + driftDims.relationships + driftDims.energy + driftDims.integrity) / 4;
            const compressed: string[] = [];
            for (let i = 0; i < skipWeeks; i++) compressed.push(compressedAvg > 50 ? "🟩" : compressedAvg > 35 ? "🟨" : "🟥");
            const compressedWeekLog = [...newWeekLog, ...compressed];
            setWeekLog(compressedWeekLog);
            setCompressing(false);

            const compressEnding = checkEnding({ week: compressedWeek, cash: compressedCash, arr: compressedArr, dims: driftDims });
            if (compressEnding) {
              addTimeout(() => onEnd(compressEnding, compressedArr, driftDims, newDecisions, compressedWeekLog), 1500);
              return;
            }

            advanceToNextTension(compressedWeek, driftDims, compressedCash, compressedArr, newDecisions, compressedWeekLog);
          }, 3000);
        };
      }
    } else {
      pendingContinueRef.current = () => {
        setWaitingForTap(false);
        advanceToNextTension(newWeek, newDims, newCash, newArr, newDecisions, newWeekLog);
      };
    }

    // Show "tap to continue" after a brief pause
    addTimeout(() => setWaitingForTap(true), 1500);
  };

  const handleContinue = () => {
    if (pendingContinueRef.current) {
      pendingContinueRef.current();
      pendingContinueRef.current = null;
    }
  };

  // Interpolate real game values into tension context text
  const interpolateContext = (text: string): string => {
    const runwayMonths = Math.max(1, Math.round(cash / 150));
    const effectiveArr = Math.max(arr, 5); // Floor at $5M for narrative — no $0M offers
    return text
      .replace(/\$1\.2M left/, `$${(cash / 1000).toFixed(1)}M left`)
      .replace(/8 months of runway/, `${runwayMonths} months of runway`)
      .replace(/Runway is 4 months/, `Runway is ${runwayMonths} months`)
      .replace(/\$800K/, `$${Math.max(200, Math.round(cash * 0.35))}K`)
      .replace(/\$45M/, `$${Math.round(effectiveArr * 1.5)}M`)
      .replace(/\$80M/, `$${Math.round(effectiveArr * 2.8)}M`)
      .replace(/\$5M at/, `$${Math.round(effectiveArr * 0.8 + 2)}M at`);
  };

  const handleCustomSubmit = () => {
    if (customText.trim()) {
      handleChoice(customText.trim(), {}, true);
    }
  };

  return (
    <SceneBackground sceneKey={sceneKey} mood={liveMood}>
      <div style={{
        maxWidth: 520, margin: "0 auto",
        padding: "max(24px, env(safe-area-inset-top, 0px)) max(20px, env(safe-area-inset-right, 0px)) max(24px, env(safe-area-inset-bottom, 0px)) max(20px, env(safe-area-inset-left, 0px))",
        fontFamily: FONTS.body, minHeight: "100vh",
        display: "flex", flexDirection: "column",
      }}>
        {/* Dashboard surface */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.06)",
          padding: "20px 20px 16px",
          marginBottom: 24,
        }}>
          {/* Header */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: 16, paddingBottom: 14,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div>
              <div style={{
                fontFamily: FONTS.display, fontSize: 20, color: "#fff", fontWeight: 600,
              }}>{companyName}</div>
              <div style={{
                fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: FONTS.mono, marginTop: 2,
              }}>Week {week} of 52</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{
                fontSize: 18, fontWeight: 700, color: "#fff",
                fontFamily: FONTS.mono,
              }}>${arr}M <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>ARR</span></div>
              <div style={{
                fontSize: 12, color: cash < 400 ? "rgba(248,113,113,0.9)" : "rgba(255,255,255,0.4)",
                fontFamily: FONTS.mono, marginTop: 2,
              }}>${cash}K cash</div>
            </div>
          </div>

          {/* Four dimensions */}
          <div style={{ marginBottom: weekLog.length > 0 ? 14 : 0 }}>
            <DimBar label="Company" value={dims.company} />
            <DimBar label="Relation" value={dims.relationships} />
            <DimBar label="Energy" value={dims.energy} />
            <DimBar label="Integrity" value={dims.integrity} />
          </div>

          {/* Journey timeline */}
          {weekLog.length > 0 && (() => {
            const avg = (dims.company + dims.relationships + dims.energy + dims.integrity) / 4;
            const trend = weekLog.length >= 2
              ? (() => {
                  const recent = weekLog.slice(-3);
                  const goodCount = recent.filter(w => w === "🟩" || w === "🏆").length;
                  const badCount = recent.filter(w => w === "🟥" || w === "💀").length;
                  if (goodCount > badCount) return "up";
                  if (badCount > goodCount) return "down";
                  return "flat";
                })()
              : "flat";
            const trendArrow = trend === "up" ? "↑" : trend === "down" ? "↓" : "→";
            const trendColor = trend === "up"
              ? "rgba(134,239,172,0.8)"
              : trend === "down"
                ? "rgba(248,113,113,0.8)"
                : "rgba(255,255,255,0.3)";

            return (
              <div style={{
                paddingTop: 14,
                borderTop: "1px solid rgba(255,255,255,0.04)",
              }}>
                {/* Overall health summary */}
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  marginBottom: 10,
                }}>
                  <span style={{
                    fontSize: 11, color: "rgba(255,255,255,0.3)",
                    fontFamily: FONTS.mono,
                  }}>
                    {weekLog.length} week{weekLog.length !== 1 ? "s" : ""}
                  </span>
                  <span style={{
                    fontSize: 12, fontFamily: FONTS.mono,
                    color: trendColor,
                    display: "flex", alignItems: "center", gap: 4,
                  }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>overall</span>
                    <span style={{ fontWeight: 600 }}>{Math.round(avg)}</span>
                    <span>{trendArrow}</span>
                  </span>
                </div>

                {/* Timeline bar */}
                <div
                  aria-label={`Journey progress: ${weekLog.length} weeks`}
                  style={{
                    display: "flex", gap: 2, flexWrap: "wrap",
                    justifyContent: "flex-start",
                  }}
                >
                  {weekLog.map((w, i) => {
                    let color = "rgba(134,239,172,0.5)";
                    let size = 7;
                    if (w === "🟨") { color = "rgba(253,224,71,0.55)"; }
                    else if (w === "🟥") { color = "rgba(248,113,113,0.6)"; }
                    else if (w === "💀") { color = "rgba(248,113,113,0.9)"; size = 9; }
                    else if (w === "🏆") { color = "rgba(250,204,21,0.85)"; size = 9; }
                    const isLatest = i === weekLog.length - 1;
                    return (
                      <div
                        key={i}
                        aria-hidden="true"
                        style={{
                          width: size, height: size,
                          borderRadius: 2,
                          background: color,
                          transition: "all 0.3s ease",
                          opacity: isLatest ? 1 : 0.7 + (i / weekLog.length) * 0.3,
                          animation: isLatest ? "pulse 2s infinite" : "none",
                        }}
                      />
                    );
                  })}
                  {/* Empty future weeks */}
                  {Array.from({ length: Math.max(0, 52 - weekLog.length) }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      aria-hidden="true"
                      style={{
                        width: 7, height: 7,
                        borderRadius: 2,
                        background: "rgba(255,255,255,0.04)",
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Breathing moment / Loading state */}
        {showBreathing && (
          <div
            role="status"
            aria-live="polite"
            style={{
            textAlign: "center",
            padding: "40px 20px",
            animation: "fadeUp 0.5s ease",
          }}>
            <div style={{
              fontFamily: FONTS.display,
              fontSize: 17,
              color: "rgba(255,255,255,0.45)",
              fontStyle: "italic",
              lineHeight: 1.7,
              maxWidth: 340,
              margin: "0 auto",
            }}>
              {breathingMoment}
            </div>
            <div style={{
              width: 24, height: 2,
              background: "rgba(255,255,255,0.15)",
              margin: "24px auto 0",
              animation: "pulse 1.5s infinite",
            }} />
          </div>
        )}

        {/* Time compression */}
        {compressing && (
          <div style={{
            textAlign: "center",
            padding: "40px 20px",
            animation: "fadeUp 0.5s ease",
          }}>
            <div style={{
              fontFamily: FONTS.mono,
              fontSize: 14,
              color: "rgba(255,255,255,0.3)",
              marginBottom: 12,
            }}>
              {compressWeeks} quiet week{compressWeeks > 1 ? "s" : ""} passed...
            </div>
            <div style={{
              fontFamily: FONTS.display,
              fontSize: 16,
              color: "rgba(255,255,255,0.45)",
              fontStyle: "italic",
              lineHeight: 1.6,
            }}>
              {compressMoment}
            </div>
          </div>
        )}

        {/* Narrative result — tap to continue */}
        {narrative && !showBreathing && !compressing && (
          <div
            onClick={waitingForTap ? handleContinue : undefined}
            onKeyDown={waitingForTap ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleContinue(); } } : undefined}
            role={waitingForTap ? "button" : undefined}
            tabIndex={waitingForTap ? 0 : undefined}
            aria-label={waitingForTap ? "Continue to next week" : undefined}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20,
              padding: "28px 24px",
              marginBottom: 24,
              animation: "fadeUp 0.6s ease",
              cursor: waitingForTap ? "pointer" : "default",
              transition: "border-color 0.3s ease",
            }}
          >
            <div style={{
              fontSize: 15,
              color: "rgba(255,255,255,0.8)",
              lineHeight: 1.7,
              fontFamily: FONTS.body,
            }}>
              {narrative}
            </div>
            {foreshadow && (
              <div style={{
                marginTop: 16,
                paddingTop: 12,
                borderTop: "1px solid rgba(255,255,255,0.04)",
                opacity: 0,
                animation: "fadeUp 0.8s ease 1.5s forwards",
              }}>
                <div style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.3)",
                  fontStyle: "italic",
                  fontFamily: FONTS.display,
                  lineHeight: 1.6,
                }}>
                  {foreshadow}
                </div>
              </div>
            )}
            {waitingForTap && (
              <div style={{
                marginTop: 20,
                textAlign: "center",
                opacity: 0,
                animation: "fadeUp 0.6s ease 0.3s forwards",
              }}>
                <span style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.25)",
                  fontFamily: FONTS.mono,
                  letterSpacing: "1px",
                }}>
                  tap to continue
                </span>
              </div>
            )}
          </div>
        )}

        {/* SURPRISE EVENT — the world moved without you */}
        {surpriseEvent && !loading && !narrative && !compressing && !milestone && (
          <div style={{
            flex: 1,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            animation: "dropIn 0.8s ease",
            padding: "40px 20px",
          }}>
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: "40px 28px",
              maxWidth: 400,
              textAlign: "center",
            }}>
              <div style={{
                fontFamily: FONTS.display,
                fontSize: "clamp(22px, 5vw, 28px)",
                color: "#fff",
                fontWeight: 600,
                lineHeight: 1.3,
                marginBottom: 16,
              }}>
                {surpriseEvent.message}
              </div>
              <div style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.4)",
                fontStyle: "italic",
                fontFamily: FONTS.display,
                lineHeight: 1.6,
              }}>
                {surpriseEvent.subtext}
              </div>
            </div>
          </div>
        )}

        {/* MILESTONE — the game celebrates you */}
        {milestone && !loading && !narrative && !compressing && !surpriseEvent && (
          <div style={{
            flex: 1,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            animation: "milestoneGlow 1.2s ease",
            padding: "40px 20px",
          }}>
            <div style={{
              textAlign: "center",
              maxWidth: 360,
            }}>
              <div style={{
                fontFamily: FONTS.display,
                fontSize: "clamp(28px, 6vw, 36px)",
                color: "#fff",
                fontWeight: 700,
                lineHeight: 1.2,
                marginBottom: 20,
                letterSpacing: "-0.5px",
              }}>
                {milestone.message}
              </div>
              <div style={{
                fontSize: 15,
                color: "rgba(255,255,255,0.5)",
                fontFamily: FONTS.display,
                fontStyle: "italic",
                lineHeight: 1.7,
              }}>
                {milestone.subtext}
              </div>
            </div>
          </div>
        )}

        {/* Tension / Decision — visual weight varies by stakes */}
        {tension && !loading && !narrative && !compressing && !surpriseEvent && !milestone && (
          <div style={{
            flex: 1,
            display: "flex", flexDirection: "column", justifyContent: "center",
            animation: stakes === 'critical' ? "slowReveal 1.2s ease" : stakes === 'high' ? "slowReveal 0.9s ease" : stakes === 'low' ? "quickFade 0.3s ease" : "fadeUp 0.6s ease",
          }}>
            {/* Category tag — consequence tensions get a special marker */}
            <div style={{
              textAlign: "center",
              marginBottom: stakes === 'critical' ? 24 : 16,
            }}>
              {isConsequence ? (
                <span style={{
                  fontSize: 10,
                  fontFamily: FONTS.mono,
                  color: "rgba(248,113,113,0.6)",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                }}>
                  YOUR CHOICES CAUGHT UP
                </span>
              ) : (
                <span style={{
                  fontSize: 10,
                  fontFamily: FONTS.mono,
                  color: "rgba(255,255,255,0.2)",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                }}>
                  {tension.category}
                </span>
              )}
            </div>
            {/* Context — size and weight vary by stakes */}
            <div style={{
              textAlign: "center",
              marginBottom: stakes === 'critical' ? 44 : stakes === 'high' ? 36 : 28,
              padding: "0 12px",
            }}>
              <div style={{
                fontFamily: FONTS.display,
                fontSize: stakes === 'critical'
                  ? "clamp(22px, 5vw, 30px)"
                  : stakes === 'high'
                    ? "clamp(20px, 4.5vw, 26px)"
                    : "clamp(18px, 4vw, 24px)",
                color: stakes === 'critical'
                  ? "rgba(255,255,255,0.95)"
                  : "rgba(255,255,255,0.85)",
                lineHeight: stakes === 'critical' ? 1.5 : 1.6,
                fontWeight: stakes === 'critical' ? 500 : 400,
              }}>
                {interpolateContext(tension.context)}
              </div>
            </div>

            {/* Binary choice — delayed reveal based on stakes */}
            {showChoices && (
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 0, marginBottom: 20,
                animation: stakes === 'critical' ? "fadeUp 0.8s ease" : stakes === 'high' ? "fadeUp 0.6s ease" : "quickFade 0.3s ease",
              }}>
                {[
                  { label: tension.left, effects: tension.leftEffect },
                  { label: tension.right, effects: tension.rightEffect },
                ].map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleChoice(opt.label, opt.effects)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "rgba(255,255,255,0.55)",
                      padding: "20px 28px",
                      fontSize: stakes === 'critical' ? 16 : 15,
                      fontWeight: 500,
                      letterSpacing: "0.5px",
                      cursor: "pointer",
                      fontFamily: FONTS.body,
                      transition: "all 0.4s ease",
                      lineHeight: 1.3,
                      position: "relative",
                      borderLeft: i === 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {/* Choices loading indicator — shows during delayed reveal */}
            {!showChoices && (
              <div style={{
                textAlign: "center", padding: "20px 0",
                animation: "pulse 1.5s infinite",
              }}>
                <div style={{
                  width: 24, height: 2,
                  background: "rgba(255,255,255,0.1)",
                  margin: "0 auto",
                  borderRadius: 1,
                }} />
              </div>
            )}

            {/* Custom input — unlocks when desperate */}
            {isDesperate && showChoices && !showCustom && (
              <button
                onClick={() => setShowCustom(true)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "rgba(255,255,255,0.25)",
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: FONTS.mono,
                  padding: "8px 0",
                  transition: "color 0.3s",
                  textAlign: "center",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.25)"}
              >
                Neither — I have my own idea &rarr;
              </button>
            )}

            {showCustom && (
              <div style={{
                marginTop: 8,
                animation: "fadeUp 0.4s ease",
              }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    value={customText}
                    onChange={e => setCustomText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleCustomSubmit()}
                    placeholder="Type your move..."
                    aria-label="Type your own decision"
                    maxLength={200}
                    autoFocus
                    style={{
                      flex: 1,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 10,
                      padding: "12px 16px",
                      fontSize: 14,
                      color: "#fff",
                      fontFamily: FONTS.body,
                      outline: "none",
                    }}
                  />
                  <button
                    onClick={handleCustomSubmit}
                    disabled={!customText.trim()}
                    aria-label="Submit your decision"
                    style={{
                      background: customText.trim() ? "rgba(255,255,255,0.1)" : "transparent",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "#fff",
                      padding: "12px 20px",
                      borderRadius: 10,
                      cursor: customText.trim() ? "pointer" : "default",
                      fontSize: 14,
                      fontFamily: FONTS.body,
                    }}
                  >
                    &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </SceneBackground>
  );
}
