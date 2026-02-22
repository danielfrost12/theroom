'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { FONTS, COLORS, TEMPO, getActTempo, shouldEarnSilence, getDashboardVisibility, weekDotColor } from '@/lib/game/constants';
import { GameDimensions, Ending, Decision, IndexedTension, TensionFormat } from '@/lib/game/types';
import { getSceneForState, getBreathingMoment, getCompressionLine, getAct, getTension, checkEnding, checkSurpriseEvent, checkMilestone, getTensionStakes, detectArchetype, getArchetypeBias, getArchetypeMirror, getEndingLastLine, type SurpriseEvent, type Milestone, type TensionStakes } from '@/lib/game/engine';
import { generateNarrative } from '@/lib/ai/narrative';
import { SceneBackground } from './SceneBackground';
import { DimBar } from './DimBar';

interface GameProps {
  companyName: string;
  firstChoice: string;
  onEnd: (ending: Ending, arr: number, dims: GameDimensions, decisions: Decision[], weekLog: string[], pivotalMoments: string[]) => void;
}

export function Game({ companyName, firstChoice, onEnd }: GameProps) {
  const [week, setWeek] = useState(1);
  const [cash, setCash] = useState(2500);
  const [arr, setArr] = useState(0);
  const [dims, setDims] = useState<GameDimensions>(() => {
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
  const [pivotalMoments, setPivotalMoments] = useState<string[]>([]);
  const [dimCrisisTracked, setDimCrisisTracked] = useState<Set<string>>(new Set());
  const [customText, setCustomText] = useState("");
  const [compressing, setCompressing] = useState(false);
  const [compressWeeks, setCompressWeeks] = useState(0);
  const [compressMoment, setCompressMoment] = useState<string>("");
  const [waitingForTap, setWaitingForTap] = useState(false);
  const [foreshadow, setForeshadow] = useState<string | null>(null);
  const [isConsequence, setIsConsequence] = useState(false);
  const [stakes, setStakes] = useState<TensionStakes>('medium');
  const [surpriseEvent, setSurpriseEvent] = useState<SurpriseEvent | null>(null);
  const [usedEvents, setUsedEvents] = useState<Set<string>>(new Set());
  const [milestone, setMilestone] = useState<Milestone | null>(null);
  const [usedMilestones, setUsedMilestones] = useState<Set<string>>(new Set());
  const [archetypeBias, setArchetypeBias] = useState<Record<string, number>>({});
  const [earnedSilence, setEarnedSilence] = useState(false);
  const [isFourthWall, setIsFourthWall] = useState(false);
  const [lastLine, setLastLine] = useState<string | null>(null);
  const [archetypeMirror, setArchetypeMirror] = useState<string | null>(null);
  const pendingContinueRef = useRef<(() => void) | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const usedTensionsRef = useRef<Set<number>>(new Set());

  useEffect(() => { usedTensionsRef.current = usedTensions; }, [usedTensions]);
  useEffect(() => { return () => { timeoutsRef.current.forEach(clearTimeout); }; }, []);

  const addTimeout = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
    return id;
  };

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  // Show the ending last line, then transition to endgame
  const triggerEnding = (ending: Ending, finalArr: number, finalDims: GameDimensions, finalDecisions: Decision[], finalWeekLog: string[], delay: number) => {
    const line = getEndingLastLine(ending, finalDims);
    setLastLine(line);
    setNarrative(null);
    setSurpriseEvent(null);
    setMilestone(null);
    setCompressing(false);
    setShowBreathing(false);
    addTimeout(() => {
      onEnd(ending, finalArr, finalDims, finalDecisions, finalWeekLog, pivotalMoments);
    }, delay + 3500); // Last line holds for 3.5 seconds, then endgame
  };

  // Get initial tension
  useEffect(() => {
    const pastChoices = decisions.map(d => d.choice);
    const t = getTension(week, usedTensions, dims, cash, pastChoices, archetypeBias);
    setTension(t);
    setIsConsequence(!!t.requires);
    setStakes(getTensionStakes(t, dims));
    setUsedTensions(prev => new Set([...prev, t.idx]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sceneKey = getSceneForState(dims, week);

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

  const [choicesVisible, setChoicesVisible] = useState(false);

  const tensionFormat: TensionFormat = tension?.format || 'standard';

  // Stakes whisper — what's at risk, computed from current dims + tension effects
  const stakesWhisper = useMemo(() => {
    if (!tension) return null;
    const dimLabels: Record<string, string> = { company: 'Company', relationships: 'People', energy: 'Energy', integrity: 'Ethics' };
    const dimKeys = ['company', 'relationships', 'energy', 'integrity'] as const;

    // Find the weakest dimension that could get hit by either choice
    let worstDim: string | null = null;
    let worstVal = 100;
    for (const k of dimKeys) {
      const val = dims[k];
      const leftHit = tension.leftEffect[k] || 0;
      const rightHit = tension.rightEffect[k] || 0;
      // If BOTH choices hurt this dim, or if it's already low and one choice hurts it
      const bothHurt = leftHit < 0 && rightHit < 0;
      const lowAndVulnerable = val < 40 && (leftHit < -8 || rightHit < -8);
      if ((bothHurt || lowAndVulnerable) && val < worstVal) {
        worstVal = val;
        worstDim = k;
      }
    }
    if (!worstDim || worstVal > 55) return null; // Only whisper when something is actually at risk
    return `${dimLabels[worstDim]} is at ${worstVal}.`;
  }, [tension, dims]);

  const interpolateContext = (text: string): string => {
    const runwayMonths = Math.max(1, Math.round(cash / 150));
    const effectiveArr = Math.max(arr, 5);
    return text
      .replace(/\$1\.2M left/, `$${(cash / 1000).toFixed(1)}M left`)
      .replace(/8 months of runway/, `${runwayMonths} months of runway`)
      .replace(/Runway is 4 months/, `Runway is ${runwayMonths} months`)
      .replace(/\$800K/, `$${Math.max(200, Math.round(cash * 0.35))}K`)
      .replace(/\$45M/, `$${Math.round(effectiveArr * 1.5)}M`)
      .replace(/\$80M/, `$${Math.round(effectiveArr * 2.8)}M`)
      .replace(/\$5M at/, `$${Math.round(effectiveArr * 0.8 + 2)}M at`);
  };

  const contextText = tension ? interpolateContext(tension.context) : '';

  // --- ADVANCE TO NEXT TENSION ---
  const advanceToNextTension = (w: number, d: GameDimensions, c: number, a: number, decs: Decision[], wLog: string[]) => {
    // Check for milestone
    const ms = checkMilestone({ week: w, dims: d, arr: a, cash: c }, usedMilestones);
    if (ms) {
      setMilestone(ms);
      setUsedMilestones(prev => new Set([...prev, ms.once]));
      setNarrative(null);
      addTimeout(() => {
        setMilestone(null);
        loadNextTension(w, d, c, decs);
      }, TEMPO.milestoneDisplay);
      return;
    }

    // Check for surprise event
    const surprise = checkSurpriseEvent({ week: w, dims: d, cash: c, arr: a, pastChoices: decs.map(dd => dd.choice) }, usedEvents);
    if (surprise) {
      setSurpriseEvent(surprise);
      if (surprise.once) setUsedEvents(prev => new Set([...prev, surprise.once!]));
      setNarrative(null);

      // Track human cost — when people leave, it's a pivotal moment
      const humanCostMap: Record<string, string> = {
        elena_quit: `Week ${w}: Elena resigned`,
        marcus_leaves: `Week ${w}: Marcus left for the competitor`,
        glassdoor: `Week ${w}: Someone wrote that Glassdoor review`,
        client_churn: `Week ${w}: Your biggest client walked away`,
        david_forward: `Week ${w}: David stopped trusting you`,
      };
      if (surprise.once && humanCostMap[surprise.once]) {
        setPivotalMoments(prev => [...prev.slice(-(4 - 1)), humanCostMap[surprise.once!]]);
      }

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

        const sAvg = (sDims.company + sDims.relationships + sDims.energy + sDims.integrity) / 4;
        const sColor = sAvg > 65 ? "🟩" : sAvg > 45 ? "🟨" : "🟥";
        const sWeekLog = [...wLog, sColor];
        setWeekLog(sWeekLog);
        setWeek(w + 1);

        const sEnding = checkEnding({ week: w + 1, cash: sCash, arr: sArr, dims: sDims });
        if (sEnding) {
          triggerEnding(sEnding, sArr, sDims, decs, sWeekLog, TEMPO.endingDelay / 2);
          return;
        }

        addTimeout(() => {
          setSurpriseEvent(null);
          loadNextTension(w + 1, sDims, sCash, decs);
        }, TEMPO.surpriseResolve);
      }, TEMPO.surpriseDisplay);
      return;
    }

    // Normal: straight to next tension
    loadNextTension(w, d, c, decs);
  };

  const loadNextTension = (w: number, d: GameDimensions, c: number, decs: Decision[]) => {
    // Every 10 weeks, re-detect archetype and update tension bias + mirror
    if (w % 10 === 0 && w > 0) {
      const arch = detectArchetype(d, decs, w);
      const bias = getArchetypeBias(arch);
      setArchetypeBias(bias);
      const mirror = getArchetypeMirror(arch, w);
      setArchetypeMirror(mirror);
    } else {
      setArchetypeMirror(null);
    }

    const t = getTension(w, usedTensionsRef.current, d, c, decs.map(dd => dd.choice), archetypeBias);
    setTension(t);
    setIsConsequence(!!t.requires);
    setStakes(getTensionStakes(t, d));
    setUsedTensions(prev => new Set([...prev, t.idx]));
    setNarrative(null);
    setShowCustom(false);
    setCustomText("");
    setIsFourthWall(!!t.fourthWall);
    setChoicesVisible(false);
  };

  // --- HANDLE CHOICE ---
  const handleChoice = async (choice: string, effects: Partial<GameDimensions>, isCustom = false) => {
    clearAllTimeouts();
    setLoading(true);
    setNarrative(null);
    setForeshadow(null);
    setIsFourthWall(false);

    // Earned silence: after critical Act 2/3 choices, show darkness instead of a breathing quote
    const silenceEarned = shouldEarnSilence(week, stakes, isConsequence);
    setEarnedSilence(silenceEarned);

    // Early Act 1: skip breathing moments — fall forward into the next choice
    const choiceTempo = getActTempo(getAct(week));
    const skipBreathing = choiceTempo.skipBreathingBefore && week < choiceTempo.skipBreathingBefore;

    if (skipBreathing) {
      setShowBreathing(false);
    } else if (!silenceEarned) {
      setShowBreathing(true);
      setBreathingMoment(getBreathingMoment(dims, week));
    } else {
      // Void: just darkness. No text. The choice is the content.
      setShowBreathing(true);
      setBreathingMoment(null);
    }

    // Check for foreshadowing on this choice
    if (tension) {
      const isLeft = choice === tension.left;
      const shadow = isLeft ? tension.leftForeshadow : tension.rightForeshadow;
      if (shadow) setForeshadow(shadow);
    }

    // Apply effects with momentum dampening + honeymoon protection
    const newDims = { ...dims };
    const currentAct = getAct(week);
    if (!isCustom) {
      (Object.keys(effects) as (keyof GameDimensions)[]).forEach(k => {
        let delta = effects[k] || 0;
        // Honeymoon protection: slight cushion in Act 1 — but choices still hurt
        if (delta < 0 && currentAct === 1) {
          delta = Math.ceil(delta * 0.85);
        }
        // Momentum dampening: protect dimensions that are already low
        if (delta < 0 && newDims[k] < 30) {
          delta = Math.ceil(delta * 0.5);
        } else if (delta < 0 && newDims[k] < 45) {
          delta = Math.ceil(delta * 0.7);
        }
        newDims[k] = Math.max(0, Math.min(100, newDims[k] + delta));
      });
    } else {
      const swing = Math.random();
      if (swing > 0.6) {
        const lucky = ['company', 'relationships', 'energy', 'integrity'][Math.floor(Math.random() * 4)] as keyof GameDimensions;
        newDims[lucky] = Math.min(100, newDims[lucky] + 15 + Math.floor(Math.random() * 10));
        (Object.keys(newDims) as (keyof GameDimensions)[]).forEach(k => {
          if (k !== lucky) newDims[k] = Math.max(0, newDims[k] - 8 - Math.floor(Math.random() * 5));
        });
      } else {
        (Object.keys(newDims) as (keyof GameDimensions)[]).forEach(k => {
          newDims[k] = Math.max(0, newDims[k] - 5 - Math.floor(Math.random() * 8));
        });
      }
    }

    // ARR growth — realistic startup trajectory
    // Week 1: $0 ARR. By week 24, exceptional founders might hit $10-20M.
    // $60M+ is IPO territory. Growth compounds but starts tiny.
    const newWeek = week + 1;
    const act = getAct(newWeek);
    let arrDelta: number;
    if (act === 1) {
      // Early stage: tiny increments. You're pre-product-market-fit.
      if (newDims.company >= 55) arrDelta = Math.random() < 0.6 ? 1 : 0;
      else if (newDims.company >= 35) arrDelta = Math.random() < 0.3 ? 1 : 0;
      else arrDelta = Math.random() < 0.2 ? -1 : 0;
    } else if (act === 2) {
      // Growth stage: acceleration possible but not guaranteed
      const growthRate = newDims.company >= 55 ? 0.08 : newDims.company >= 40 ? 0.04 : -0.03;
      arrDelta = Math.round(Math.max(arr, 1) * growthRate * (0.5 + Math.random()));
      // Cap single-week growth
      arrDelta = Math.min(arrDelta, 4);
    } else {
      // Late stage: momentum-dependent. Big jumps possible if you earned them.
      const growthRate = newDims.company >= 60 ? 0.10 : newDims.company >= 40 ? 0.05 : -0.05;
      arrDelta = Math.round(Math.max(arr, 1) * growthRate * (0.5 + Math.random()));
      arrDelta = Math.min(arrDelta, 6);
    }
    const newArr = Math.max(0, arr + arrDelta);

    // Cash burn — $2.5M seed burns ~$100K/week, scaling with team size
    // Revenue comes from ARR (ARR/24 per week, with slight lag)
    const weeklyBurn = 40 + Math.floor(newArr * 1.5); // burn scales with growth
    const weeklyRevenue = Math.floor(newArr * 1000 / 24); // ARR is in $M, cash in $K
    const newCash = Math.max(0, cash - weeklyBurn + weeklyRevenue);

    setDims(newDims);
    setArr(newArr);
    setCash(newCash);

    // Track pivotal moments — dimension crises, consequences, milestones
    const dimNames: Record<string, string> = { company: "Company", relationships: "Relationships", energy: "Energy", integrity: "Integrity" };
    const atmosphereLines: Record<string, string> = {
      company: "The room feels emptier now.",
      relationships: "The silence between people grows louder.",
      energy: "Everything takes longer than it used to.",
      integrity: "You avoid mirrors.",
    };
    let crisisHappened = false;
    (Object.keys(newDims) as (keyof GameDimensions)[]).forEach(k => {
      if (newDims[k] < 30 && dims[k] >= 30 && !dimCrisisTracked.has(k)) {
        setDimCrisisTracked(prev => new Set([...prev, k]));
        setPivotalMoments(prev => {
          const moment = `Week ${week}: ${dimNames[k]} hit rock bottom`;
          return [...prev.slice(-(4 - 1)), moment]; // Keep max 5
        });
        // Atmosphere shift — teach the player that the world responds
        if (!crisisHappened) {
          setForeshadow(atmosphereLines[k] || "Something shifted.");
          crisisHappened = true;
        }
      }
    });
    if (isConsequence && tension) {
      // Use the callback line for specificity — "You let Marcus go" is better than "Your past caught up"
      const consequenceMoment = tension.callbackLine
        ? `Week ${week}: ${tension.callbackLine.split('.')[0]}`
        : `Week ${week}: Your past caught up`;
      setPivotalMoments(prev => [...prev.slice(-(4 - 1)), consequenceMoment]);
    }

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
      choice, newDims, week, companyName
    );

    // Enforce narrative brevity — truncate to 3 sentences max, 60 words max
    const sentences = narrativeText.match(/[^.!?]+[.!?]+/g) || [narrativeText];
    let truncated = sentences.slice(0, 3).join(' ').trim();
    const words = truncated.split(/\s+/);
    if (words.length > 60) truncated = words.slice(0, 60).join(' ') + '.';
    setNarrative(truncated);
    setShowBreathing(false);
    setLoading(false);
    setWeek(newWeek);

    // Check ending
    const ending = checkEnding({ week: newWeek, cash: newCash, arr: newArr, dims: newDims });
    if (ending) {
      triggerEnding(ending, newArr, newDims, newDecisions, newWeekLog, TEMPO.endingDelay);
      return;
    }

    // --- CONTINUATION ---
    const actTempo = getActTempo(act);
    const shouldCompress = Math.random() < actTempo.compressChance && newWeek < 22 && newWeek >= (actTempo.noCompressBefore || 0);

    if (shouldCompress) {
      const skipWeeks = Math.min(1 + Math.floor(Math.random() * 2), 24 - newWeek);
      if (skipWeeks > 0) {
        pendingContinueRef.current = () => {
          setWaitingForTap(false);
          setNarrative(null);
          setCompressing(true);
          setCompressWeeks(skipWeeks);
          setCompressMoment(getCompressionLine(newDims, newWeek, newArr));
          addTimeout(() => {
            const burnPerWeek = 40 + Math.floor(newArr * 1.5);
            const revPerWeek = Math.floor(newArr * 1000 / 24);
            const compressedCash = Math.max(0, newCash + skipWeeks * (revPerWeek - burnPerWeek));
            // Compression ARR: steady compound growth matching the new realistic pace
            const compGrowthRate = newDims.company >= 50 ? 0.05 : newDims.company >= 35 ? 0.02 : -0.02;
            const compressedArr = Math.max(0, Math.round(newArr * (1 + compGrowthRate * skipWeeks)));
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
              triggerEnding(compressEnding, compressedArr, driftDims, newDecisions, compressedWeekLog, actTempo.narrativeTapDelay);
              return;
            }

            advanceToNextTension(compressedWeek, driftDims, compressedCash, compressedArr, newDecisions, compressedWeekLog);
          }, actTempo.compressDisplay);
        };
      }
    } else {
      pendingContinueRef.current = () => {
        setWaitingForTap(false);
        advanceToNextTension(newWeek, newDims, newCash, newArr, newDecisions, newWeekLog);
      };
    }

    // Show "tap to continue" after reading pause — act-scaled + consequence bonus
    const readDelay = isConsequence ? actTempo.narrativeTapDelay + 700 : actTempo.narrativeTapDelay;
    addTimeout(() => setWaitingForTap(true), readDelay);
  };

  const handleContinue = () => {
    if (pendingContinueRef.current) {
      pendingContinueRef.current();
      pendingContinueRef.current = null;
    }
  };

  const handleCustomSubmit = () => {
    if (customText.trim()) handleChoice(customText.trim(), {}, true);
  };

  // Is the tension screen active (not loading, no narrative, no overlay)?
  const showTension = !!tension && !loading && !narrative && !compressing && !surpriseEvent && !milestone && !showBreathing;

  // Delay choices so the player must read the context before acting.
  // Stakes-based: higher stakes = longer reading pause.
  useEffect(() => {
    if (showTension && !choicesVisible) {
      const delay = stakes === 'critical' ? TEMPO.choiceRevealCrit
        : stakes === 'high' ? TEMPO.choiceRevealHigh
        : TEMPO.choiceReveal;
      const id = addTimeout(() => setChoicesVisible(true), delay);
      return () => clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTension, choicesVisible, stakes]);

  return (
    <SceneBackground sceneKey={sceneKey} mood={liveMood}>
      <div style={{
        maxWidth: 520, margin: "0 auto",
        padding: "max(24px, env(safe-area-inset-top, 0px)) max(20px, env(safe-area-inset-right, 0px)) max(24px, env(safe-area-inset-bottom, 0px)) max(20px, env(safe-area-inset-left, 0px))",
        fontFamily: FONTS.body, minHeight: "100dvh",
        display: "flex", flexDirection: "column",
      }}>

        {/* Progress Gravity — 24 dots. No numbers. You feel where you are.
            Filled dots carry the color of what happened that week. */}
        <div
          aria-label={`Week ${week} of 24`}
          style={{
            display: "flex", justifyContent: "flex-end", gap: 3,
            marginBottom: 8,
            opacity: week <= 7 ? 0.6 : week <= 17 ? 0.5 : 0.4,
            transition: "opacity 2s ease",
          }}
        >
          {Array.from({ length: 24 }).map((_, i) => {
            const isFilled = i < weekLog.length;
            const isCurrent = i === weekLog.length;
            return (
              <div key={i} style={{
                width: 5, height: 5, borderRadius: 1.5,
                background: isFilled
                  ? weekDotColor(weekLog[i])
                  : isCurrent
                    ? "rgba(255,238,210,0.4)"
                    : "rgba(255,255,255,0.06)",
                transition: "background 0.5s ease",
                animation: isCurrent ? "pulse 2.5s infinite" : "none",
              }} />
            );
          })}
        </div>

        {/* Dashboard — dissolves by act, hidden during fourth-wall moments */}
        {!compressing && !surpriseEvent && !isFourthWall && (() => {
          const viz = getDashboardVisibility(week);
          return (
          <div style={{
            background: "rgba(255,255,255,0.03)",
            borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.06)",
            padding: "20px 20px 16px",
            marginBottom: 24,
            animation: "quickFade 0.4s ease",
            opacity: viz.overall,
            transition: "opacity 2s ease",
          }}>
            {/* Header */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: 16, paddingBottom: 14,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              opacity: viz.header,
              transition: "opacity 2s ease",
            }}>
              <div>
                <div style={{
                  fontFamily: FONTS.display, fontSize: 20, color: "#fff", fontWeight: 600,
                }}>{companyName}</div>
                {viz.weekCount && (
                <div style={{
                  fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: FONTS.mono, marginTop: 2,
                }}>Week {week} of 24</div>
                )}
                {week === 8 && (
                  <div style={{
                    fontSize: 10, color: "rgba(255,255,255,0.15)", fontFamily: FONTS.mono,
                    marginTop: 2, letterSpacing: "1px",
                  }}>the grind begins</div>
                )}
                {week === 18 && (
                  <div style={{
                    fontSize: 10, color: "rgba(255,255,255,0.15)", fontFamily: FONTS.mono,
                    marginTop: 2, letterSpacing: "1px",
                  }}>the reckoning</div>
                )}
              </div>
              <div style={{ textAlign: "right", opacity: viz.cash, transition: "opacity 2s ease" }}>
                <div style={{
                  fontSize: 18, fontWeight: 700, color: "#fff",
                  fontFamily: FONTS.mono,
                }}>{arr === 0 ? (
                  <span style={{ fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.35)" }}>Pre-revenue</span>
                ) : (
                  <>${arr}M <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>ARR</span></>
                )}</div>
                <div style={{
                  fontSize: 12, color: cash < 400 ? "rgba(248,113,113,0.9)" : "rgba(255,255,255,0.4)",
                  fontFamily: FONTS.mono, marginTop: 2,
                }}>${cash}K cash</div>
              </div>
            </div>

            {/* Four dimensions */}
            <div style={{ marginBottom: weekLog.length > 0 ? 14 : 0, opacity: viz.dims, transition: "opacity 2s ease" }}>
              <DimBar label="Company" value={dims.company} hideValue={!viz.dimValues} />
              <DimBar label="People" value={dims.relationships} hideValue={!viz.dimValues} />
              <DimBar label="Energy" value={dims.energy} hideValue={!viz.dimValues} />
              <DimBar label="Ethics" value={dims.integrity} hideValue={!viz.dimValues} />
            </div>

            {/* Journey timeline */}
            {weekLog.length > 0 && (() => {
              const avg = (dims.company + dims.relationships + dims.energy + dims.integrity) / 4;
              const trend = weekLog.length >= 2
                ? (() => {
                    const recent = weekLog.slice(-3);
                    const goodCount = recent.filter(w => w === "\u{1F7E9}" || w === "\u{1F3C6}").length;
                    const badCount = recent.filter(w => w === "\u{1F7E5}" || w === "\u{1F480}").length;
                    if (goodCount > badCount) return "up";
                    if (badCount > goodCount) return "down";
                    return "flat";
                  })()
                : "flat";
              const trendArrow = trend === "up" ? "\u2191" : trend === "down" ? "\u2193" : "\u2192";
              const trendColor = trend === "up"
                ? "rgba(134,239,172,0.8)"
                : trend === "down"
                  ? "rgba(248,113,113,0.8)"
                  : "rgba(255,255,255,0.3)";

              return (
                <div style={{
                  paddingTop: 14,
                  borderTop: "1px solid rgba(255,255,255,0.04)",
                  opacity: viz.timeline,
                  transition: "opacity 2s ease",
                }}>
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
                  <div
                    aria-label={`Journey progress: ${weekLog.length} weeks`}
                    style={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "flex-start" }}
                  >
                    {weekLog.map((w, i) => {
                      let color = "rgba(134,239,172,0.5)";
                      let size = 7;
                      if (w === "\u{1F7E8}") { color = "rgba(253,224,71,0.55)"; }
                      else if (w === "\u{1F7E5}") { color = "rgba(248,113,113,0.6)"; }
                      else if (w === "\u{1F480}") { color = "rgba(248,113,113,0.9)"; size = 9; }
                      else if (w === "\u{1F3C6}") { color = "rgba(250,204,21,0.85)"; size = 9; }
                      const isLatest = i === weekLog.length - 1;
                      return (
                        <div key={i} aria-hidden="true" style={{
                          width: size, height: size, borderRadius: 2,
                          background: color, transition: "all 0.3s ease",
                          opacity: isLatest ? 1 : 0.7 + (i / weekLog.length) * 0.3,
                          animation: isLatest ? "pulse 2s infinite" : "none",
                        }} />
                      );
                    })}
                    {Array.from({ length: Math.max(0, 24 - weekLog.length) }).map((_, i) => (
                      <div key={`empty-${i}`} aria-hidden="true" style={{
                        width: 7, height: 7, borderRadius: 2,
                        background: "rgba(255,255,255,0.04)",
                      }} />
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
          );
        })()}

        {/* Ending last line — the closing shot before the endgame card */}
        {lastLine && (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            minHeight: "60dvh",
            padding: "0 32px",
            animation: "fadeUp 1.5s ease",
          }}>
            <div style={{
              fontFamily: FONTS.display,
              fontSize: "clamp(17px, 4vw, 22px)",
              color: "rgba(255,238,220,0.6)",
              fontStyle: "italic",
              lineHeight: 1.7,
              textAlign: "center",
              maxWidth: 360,
            }}>
              {lastLine}
            </div>
          </div>
        )}

        {/* Breathing moment / Earned silence */}
        {showBreathing && (
          earnedSilence ? (
            // Earned silence: just darkness. A thin line breathing. The choice IS the content.
            <div role="status" aria-live="polite" style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              minHeight: 200,
            }}>
              <div style={{
                width: 32, height: 1,
                background: "rgba(255,255,255,0.06)",
                animation: "pulse 4s ease-in-out infinite",
              }} />
            </div>
          ) : (
            <div role="status" aria-live="polite" style={{
              textAlign: "center", padding: "40px 20px",
              animation: "fadeUp 0.5s ease",
            }}>
              <div style={{
                fontFamily: FONTS.display, fontSize: 17,
                color: "rgba(255,238,220,0.45)", fontStyle: "italic",
                lineHeight: 1.7, maxWidth: 340, margin: "0 auto",
              }}>
                {breathingMoment}
              </div>
              <div style={{
                width: 24, height: 2, background: "rgba(255,255,255,0.15)",
                margin: "24px auto 0", animation: "pulse 1.5s infinite",
              }} />
            </div>
          )
        )}

        {/* Time compression */}
        {compressing && (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            textAlign: "center", padding: "40px 20px",
            animation: "fadeUp 0.5s ease",
          }}>
            <div style={{
              fontFamily: FONTS.mono, fontSize: 14,
              color: "rgba(255,255,255,0.3)", marginBottom: 12,
            }}>
              {compressWeeks} quiet week{compressWeeks > 1 ? "s" : ""} passed...
            </div>
            <div style={{
              fontFamily: FONTS.display, fontSize: 16,
              color: "rgba(255,255,255,0.45)", fontStyle: "italic",
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
              borderRadius: 20, padding: "24px 22px", marginBottom: 20,
              animation: "fadeUp 0.6s ease",
              cursor: waitingForTap ? "pointer" : "default",
              transition: "border-color 0.3s ease",
            }}
          >
            <div style={{
              fontSize: 15, color: "rgba(255,255,255,0.8)",
              lineHeight: 1.7, fontFamily: FONTS.body,
            }}>
              {narrative}
            </div>
            {foreshadow && (
              <div style={{
                marginTop: 16, paddingTop: 12,
                borderTop: "1px solid rgba(255,255,255,0.04)",
                opacity: 0, animation: "fadeUp 0.8s ease 1s forwards",
              }}>
                <div style={{
                  fontSize: 13, color: COLORS.foreshadow,
                  fontStyle: "italic", fontFamily: FONTS.display, lineHeight: 1.6,
                }}>
                  {foreshadow}
                </div>
              </div>
            )}
            {waitingForTap && (
              <div style={{
                marginTop: 18, textAlign: "center",
                opacity: 0, animation: "fadeUp 0.5s ease 0.2s forwards",
              }}>
                <span style={{
                  fontSize: 12,
                  color: COLORS.warmMuted,
                  fontFamily: FONTS.mono,
                  letterSpacing: "1px",
                  animation: "pulse 3s ease-in-out infinite",
                }}>
                  tap to continue
                </span>
              </div>
            )}
          </div>
        )}

        {/* SURPRISE EVENT */}
        {surpriseEvent && !loading && !narrative && !compressing && !milestone && (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            animation: "dropIn 0.8s ease", padding: "40px 20px",
          }}>
            <div style={{
              background: COLORS.warmGlow,
              border: "1px solid rgba(255,238,210,0.08)",
              borderRadius: 20, padding: "40px 28px",
              maxWidth: 400, textAlign: "center",
            }}>
              <div style={{
                fontFamily: FONTS.display, fontSize: "clamp(22px, 5vw, 28px)",
                color: "rgba(255,248,235,0.95)", fontWeight: 600, lineHeight: 1.3, marginBottom: 16,
              }}>
                {surpriseEvent.message}
              </div>
              <div style={{
                fontSize: 14, color: "rgba(255,238,210,0.45)",
                fontStyle: "italic", fontFamily: FONTS.display, lineHeight: 1.6,
              }}>
                {surpriseEvent.subtext}
              </div>
            </div>
          </div>
        )}

        {/* MILESTONE — inline card, doesn't block the flow */}
        {milestone && !loading && !narrative && !compressing && !surpriseEvent && (
          <div style={{
            background: COLORS.warmGlow,
            border: "1px solid rgba(255,238,210,0.08)",
            borderRadius: 16,
            padding: "20px 24px",
            marginBottom: 20,
            textAlign: "center",
            animation: "fadeUp 0.6s ease",
          }}>
            <div style={{
              fontFamily: FONTS.display, fontSize: 18,
              color: "rgba(255,248,235,0.95)", fontWeight: 600, lineHeight: 1.3,
              marginBottom: 8,
            }}>
              {milestone.message}
            </div>
            <div style={{
              fontSize: 13, color: "rgba(255,238,210,0.45)",
              fontFamily: FONTS.display, fontStyle: "italic", lineHeight: 1.6,
            }}>
              {milestone.subtext}
            </div>
          </div>
        )}

        {/* TENSION — the actual game */}
        {showTension && (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
            animation: "fadeUp 0.5s ease",
          }}>

            {/* Archetype mirror — the game sees your pattern */}
            {archetypeMirror && (
              <div style={{
                textAlign: "center", marginBottom: 24,
                opacity: 0, animation: "fadeUp 1.2s ease 0.3s forwards",
              }}>
                <div style={{
                  fontSize: 12, color: "rgba(255,238,210,0.35)",
                  fontFamily: FONTS.mono,
                  lineHeight: 1.7, maxWidth: 340, margin: "0 auto",
                  letterSpacing: "0.3px",
                }}>
                  {archetypeMirror}
                </div>
              </div>
            )}

            {/* Interiority — inner voice, before the context */}
            {tension.interiority && (
              <div style={{
                textAlign: "center", marginBottom: 20,
              }}>
                <div style={{
                  fontSize: 13, color: COLORS.interiority,
                  fontStyle: "italic", fontFamily: FONTS.display,
                  lineHeight: 1.6, maxWidth: 360, margin: "0 auto",
                }}>
                  {tension.interiority}
                </div>
              </div>
            )}

            {/* Personal context — grounds the abstract dilemma in human terms */}
            {tension.personalContext && (
              <div style={{
                textAlign: "center",
                marginBottom: 16,
                opacity: 0,
                animation: "quickFade 1s ease 0.6s forwards",
              }}>
                <div style={{
                  fontSize: 12,
                  color: COLORS.interiority,
                  fontStyle: "italic",
                  fontFamily: FONTS.body,
                  lineHeight: 1.6,
                  maxWidth: 340,
                  margin: "0 auto",
                }}>
                  {tension.personalContext}
                </div>
              </div>
            )}

            {/* Category tag */}
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              {isConsequence ? (
                <span style={{
                  fontSize: 10, fontFamily: FONTS.mono,
                  color: "rgba(248,113,113,0.6)", letterSpacing: "2px",
                  textTransform: "uppercase",
                }}>
                  YOUR CHOICES CAUGHT UP
                </span>
              ) : tensionFormat === 'forced' ? (
                <span style={{
                  fontSize: 10, fontFamily: FONTS.mono,
                  color: "rgba(255,255,255,0.15)", letterSpacing: "2px",
                  textTransform: "uppercase",
                }}>
                  THIS WASN&apos;T YOUR CALL
                </span>
              ) : (
                <span style={{
                  fontSize: 10, fontFamily: FONTS.mono,
                  color: "rgba(255,255,255,0.2)", letterSpacing: "2px",
                  textTransform: "uppercase",
                }}>
                  {tension.category}
                </span>
              )}
            </div>

            {/* Callback line — reminder of the past choice that caused this consequence */}
            {isConsequence && tension.callbackLine && (
              <div style={{
                textAlign: "center",
                marginBottom: 16,
                opacity: 0,
                animation: "quickFade 0.8s ease 0.4s forwards",
              }}>
                <div style={{
                  fontSize: 12,
                  color: "rgba(253,224,71,0.5)",
                  fontStyle: "italic",
                  fontFamily: FONTS.body,
                  lineHeight: 1.6,
                  maxWidth: 340,
                  margin: "0 auto",
                }}>
                  {tension.callbackLine}
                </div>
              </div>
            )}

            {/* --- SLACK FORMAT --- */}
            {tensionFormat === 'slack' && (
              <div style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8, padding: "16px 20px",
                marginBottom: 28, maxWidth: 420,
                alignSelf: "center", width: "100%",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: "rgba(78,204,163,0.8)",
                  }} />
                  <span style={{
                    fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)",
                    fontFamily: FONTS.body,
                  }}>{tension.sender || "Unknown"}</span>
                  <span style={{
                    fontSize: 11, color: "rgba(255,255,255,0.25)",
                    fontFamily: FONTS.mono, marginLeft: "auto",
                  }}>just now</span>
                </div>
                <div style={{
                  fontSize: 15, color: "rgba(255,255,255,0.75)",
                  lineHeight: 1.6, fontFamily: FONTS.body,
                }}>
                  {contextText}
                </div>
              </div>
            )}

            {/* --- EMAIL FORMAT --- */}
            {tensionFormat === 'email' && (
              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12, padding: "20px 24px",
                marginBottom: 28, maxWidth: 440,
                alignSelf: "center", width: "100%",
              }}>
                <div style={{
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  paddingBottom: 14, marginBottom: 14,
                }}>
                  <div style={{
                    fontSize: 11, color: "rgba(255,255,255,0.3)",
                    fontFamily: FONTS.mono, marginBottom: 4,
                  }}>From: {tension.sender || "Unknown"}</div>
                  <div style={{
                    fontSize: 15, color: "rgba(255,255,255,0.85)",
                    fontWeight: 600, fontFamily: FONTS.body,
                  }}>{tension.subject || "No Subject"}</div>
                </div>
                <div style={{
                  fontSize: 14, color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.7, fontFamily: FONTS.body,
                }}>
                  {contextText}
                </div>
              </div>
            )}

            {/* --- PHONE NOTIFICATION FORMAT --- */}
            {tensionFormat === 'phone' && (
              <div style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 16, padding: "16px 20px",
                marginBottom: 28, maxWidth: 380,
                alignSelf: "center", width: "100%",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 7,
                    background: "rgba(255,255,255,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14,
                  }}>
                    {tension.sender === 'PagerDuty' ? '\u{1F6A8}' : tension.sender === 'Home' ? '\u{1F3E0}' : '\u{1F4F1}'}
                  </div>
                  <div>
                    <div style={{
                      fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)",
                      fontFamily: FONTS.body,
                    }}>{tension.sender || "Notification"}</div>
                    <div style={{
                      fontSize: 11, color: "rgba(255,255,255,0.3)",
                      fontFamily: FONTS.mono,
                    }}>now</div>
                  </div>
                </div>
                <div style={{
                  fontSize: 15, color: "rgba(255,255,255,0.75)",
                  lineHeight: 1.5, fontFamily: FONTS.body,
                }}>
                  {contextText}
                </div>
              </div>
            )}

            {/* --- OBSERVATION FORMAT --- */}
            {tensionFormat === 'observation' && (
              <div style={{
                textAlign: "center", marginBottom: 32, padding: "0 20px",
              }}>
                <div style={{
                  fontFamily: FONTS.display,
                  fontSize: "clamp(18px, 4.5vw, 26px)",
                  color: "rgba(255,255,255,0.8)", lineHeight: 1.6,
                  fontStyle: "italic", fontWeight: 400,
                }}>
                  {contextText}
                </div>
              </div>
            )}

            {/* --- INTIMATE FORMAT --- */}
            {tensionFormat === 'intimate' && (
              <div style={{
                textAlign: "center", marginBottom: 44, padding: "0 24px",
              }}>
                <div style={{
                  fontFamily: FONTS.display,
                  fontSize: "clamp(24px, 6vw, 34px)",
                  color: "rgba(255,255,255,0.95)", lineHeight: 1.3,
                  fontWeight: 500, letterSpacing: "-0.5px",
                }}>
                  {contextText}
                </div>
              </div>
            )}

            {/* --- FORCED FORMAT --- */}
            {tensionFormat === 'forced' && (
              <div style={{
                textAlign: "center", marginBottom: 32, padding: "0 20px",
              }}>
                <div style={{
                  fontFamily: FONTS.display,
                  fontSize: "clamp(20px, 5vw, 28px)",
                  color: "rgba(255,255,255,0.9)", lineHeight: 1.5,
                  fontWeight: 400,
                }}>
                  {contextText}
                </div>
              </div>
            )}

            {/* --- STANDARD FORMAT --- */}
            {tensionFormat === 'standard' && (
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
                  {contextText}
                </div>
              </div>
            )}

            {/* Stakes whisper — what you stand to lose */}
            {stakesWhisper && choicesVisible && (
              <div style={{
                textAlign: "center", marginBottom: 12,
                opacity: 0, animation: "fadeUp 0.5s ease 0.1s forwards",
              }}>
                <span style={{
                  fontSize: 11, fontFamily: FONTS.mono,
                  color: "rgba(248,113,113,0.5)",
                  letterSpacing: "0.5px",
                }}>
                  {stakesWhisper}
                </span>
              </div>
            )}

            {/* Choices — delayed reveal forces reading the context first */}
            {choicesVisible && tensionFormat !== 'forced' && (
              <div style={{
                display: "flex", alignItems: "stretch", justifyContent: "center",
                gap: 0, marginBottom: 20,
                animation: "fadeUp 0.4s ease",
              }}>
                {[
                  { label: tension.left, effects: tension.leftEffect },
                  { label: tension.right, effects: tension.rightEffect },
                ].map((opt, i) => {
                  // Show which dimensions this choice costs — names only, not numbers
                  const costLabels: Record<string, string> = { company: 'company', relationships: 'people', energy: 'energy', integrity: 'ethics' };
                  const costs = (Object.keys(costLabels) as (keyof typeof costLabels)[])
                    .filter(k => (opt.effects[k as keyof GameDimensions] || 0) <= -8)
                    .map(k => costLabels[k]);

                  return (
                    <button
                      key={i}
                      onClick={() => handleChoice(opt.label, opt.effects)}
                      style={{
                        background: "transparent", border: "none",
                        color: COLORS.warm,
                        padding: "18px 24px 14px",
                        cursor: "pointer", fontFamily: FONTS.body,
                        transition: "all 0.3s ease",
                        position: "relative",
                        borderLeft: i === 1 ? "1px solid rgba(255,238,210,0.1)" : "none",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = COLORS.warmHover; }}
                      onMouseLeave={e => { e.currentTarget.style.color = COLORS.warm; }}
                    >
                      <span style={{
                        fontSize: stakes === 'critical' ? 16 : 15,
                        fontWeight: 500, letterSpacing: "0.5px", lineHeight: 1.3,
                      }}>
                        {opt.label}
                      </span>
                      {costs.length > 0 && (
                        <span style={{
                          fontSize: 10, fontFamily: FONTS.mono,
                          color: "rgba(255,255,255,0.18)",
                          letterSpacing: "0.5px",
                        }}>
                          costs {costs.join(', ')}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Forced choice — single button, player taps it */}
            {choicesVisible && tensionFormat === 'forced' && (
              <div style={{
                textAlign: "center", marginBottom: 20,
                animation: "fadeUp 0.4s ease",
              }}>
                <button
                  onClick={() => {
                    const side = tension.forcedChoice || 'left';
                    const effects = side === 'left' ? tension.leftEffect : tension.rightEffect;
                    const label = side === 'left' ? tension.left : tension.right;
                    handleChoice(label, effects);
                  }}
                  style={{
                    background: "transparent", border: "none",
                    color: COLORS.warmMuted,
                    padding: "20px 28px", fontSize: 15, fontWeight: 400,
                    cursor: "pointer", fontFamily: FONTS.body,
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = COLORS.warm; }}
                  onMouseLeave={e => { e.currentTarget.style.color = COLORS.warmMuted; }}
                >
                  {tension.forcedChoice === 'left' ? tension.left : tension.right}
                </button>
              </div>
            )}

            {/* Custom input — unlocks when desperate */}
            {choicesVisible && isDesperate && !showCustom && tensionFormat !== 'forced' && (
              <button
                onClick={() => setShowCustom(true)}
                style={{
                  background: "transparent", border: "none",
                  color: COLORS.warmMuted, fontSize: 13,
                  cursor: "pointer", fontFamily: FONTS.mono,
                  padding: "8px 0", transition: "color 0.3s",
                  textAlign: "center",
                }}
                onMouseEnter={e => e.currentTarget.style.color = COLORS.warm}
                onMouseLeave={e => e.currentTarget.style.color = COLORS.warmMuted}
              >
                Neither &mdash; I have my own idea &rarr;
              </button>
            )}

            {showCustom && (
              <div style={{ marginTop: 8, animation: "fadeUp 0.4s ease" }}>
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
                      flex: 1, background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 10, padding: "12px 16px",
                      fontSize: 14, color: "#fff", fontFamily: FONTS.body,
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
                      color: "#fff", padding: "12px 20px", borderRadius: 10,
                      cursor: customText.trim() ? "pointer" : "default",
                      fontSize: 14, fontFamily: FONTS.body,
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
