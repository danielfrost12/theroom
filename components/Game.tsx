'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { FONTS, COLORS, TEMPO, getActTempo, shouldEarnSilence, getDashboardVisibility } from '@/lib/game/constants';
import { GameDimensions, Ending, Decision, IndexedTension, TensionFormat } from '@/lib/game/types';
import { getSceneForState, getBreathingMoment, getCompressionLine, getAct, getTension, checkEnding, checkSurpriseEvent, checkMilestone, getTensionStakes, detectArchetype, getArchetypeBias, getArchetypeMirror, getEndingLastLine, type SurpriseEvent, type Milestone, type TensionStakes } from '@/lib/game/engine';
import { generateNarrative, evaluateCustomChoice } from '@/lib/ai/narrative';
import { getLastPlay } from '@/lib/game/stats';
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
    const base = { company: 45, relationships: 50, energy: 55, integrity: 60 };
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
  const [peakMoment, setPeakMoment] = useState<string | null>(null);
  const [peakShown, setPeakShown] = useState(false);
  const [selectedDot, setSelectedDot] = useState<number | null>(null);
  const [customOutcome, setCustomOutcome] = useState<{ effects: Partial<GameDimensions>; wasCustom: boolean; verdict?: string } | null>(null);
  const pendingContinueRef = useRef<(() => void) | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const usedTensionsRef = useRef<Set<number>>(new Set());
  const customInputRef = useRef<HTMLInputElement>(null);

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

  // The ghost — your last playthrough, used to haunt this one
  const [ghost] = useState(() => getLastPlay());

  // Get initial tension
  useEffect(() => {
    const pastChoices = decisions.map(d => d.choice);
    const t = getTension(week, usedTensions, dims, cash, pastChoices, archetypeBias, ghost, usedEvents);
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
    // Peak-End Rule (Kahneman): One designed peak moment in Act 2 (week 13).
    // Full-screen. Intimate. Not a question about the company. A question about the person playing.
    if (w === 13 && !peakShown) {
      setPeakShown(true);
      const avg = (d.company + d.relationships + d.energy + d.integrity) / 4;
      const peakLine = avg > 55
        ? "Halfway. You\u2019re still standing. Was it supposed to feel like this?"
        : d.energy < 35
          ? "Halfway. Your body knows the answer even if you don\u2019t."
          : d.relationships < 35
            ? "Halfway. Look around the room. Who\u2019s still here?"
            : "Halfway. Is this the story you meant to write?";
      setPeakMoment(peakLine);
      setNarrative(null);
      setSurpriseEvent(null);
      setMilestone(null);
      setCompressing(false);
      setShowBreathing(false);
      addTimeout(() => {
        setPeakMoment(null);
        loadNextTension(w, d, c, decs);
      }, 6000); // Holds for 6 seconds — Socrates: let the question breathe
      return;
    }

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

    const t = getTension(w, usedTensionsRef.current, d, c, decs.map(dd => dd.choice), archetypeBias, ghost, usedEvents);
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
  const handleChoice = async (choice: string, effects: Partial<GameDimensions>, isCustom = false, showAsCustom = false, verdict?: string) => {
    clearAllTimeouts();
    setLoading(true);
    setNarrative(null);
    setForeshadow(null);
    setIsFourthWall(false);
    setCustomOutcome((isCustom || showAsCustom) ? { effects, wasCustom: true, verdict } : null);

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
      setBreathingMoment(getBreathingMoment(dims, week, usedEvents));
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

    // Apply effects — LOSS AVERSION: first plays have LESS protection.
    // First-timers should die. That's the hook. "I can do better" only works if the first run stings.
    // Returning players get slightly more cushion because they've earned the right to explore.
    const isFirstPlay = !ghost; // No previous play = first timer
    const newDims = { ...dims };
    const currentAct = getAct(week);
    if (!isCustom) {
      (Object.keys(effects) as (keyof GameDimensions)[]).forEach(k => {
        let delta = effects[k] || 0;
        // Honeymoon protection: ONLY for returning players in Act 1.
        // First-timers feel the full weight from week 1. Every choice costs.
        if (delta < 0 && currentAct === 1 && !isFirstPlay) {
          delta = Math.ceil(delta * 0.9);
        }
        // Floor protection: first-timers get NONE. Returning players get a small cushion.
        // This means first plays spiral faster when they make bad choices.
        if (delta < 0 && newDims[k] < 15 && !isFirstPlay) {
          delta = Math.ceil(delta * 0.5);
        }
        newDims[k] = Math.max(0, Math.min(100, newDims[k] + delta));
      });
    } else {
      // Custom choices: modest random effects (AI evaluation happens separately if available)
      const swing = Math.random();
      if (swing > 0.5) {
        // 50% chance: creative swing — boost weakest dimension, small cost to strongest
        const dimEntries = (Object.keys(newDims) as (keyof GameDimensions)[]).map(k => ({ k, v: newDims[k] }));
        const weakest = dimEntries.reduce((a, b) => a.v < b.v ? a : b);
        const strongest = dimEntries.reduce((a, b) => a.v > b.v ? a : b);
        newDims[weakest.k] = Math.min(100, newDims[weakest.k] + 8 + Math.floor(Math.random() * 8));
        newDims[strongest.k] = Math.max(0, newDims[strongest.k] - 3 - Math.floor(Math.random() * 4));
      } else {
        // 50% chance: scattered — small cost across all, but never catastrophic
        (Object.keys(newDims) as (keyof GameDimensions)[]).forEach(k => {
          newDims[k] = Math.max(0, newDims[k] - 2 - Math.floor(Math.random() * 5));
        });
      }
    }

    // Natural recovery — REMOVED for all players.
    // Every dimension point is earned through choices. No free healing.
    // The game should punish neglect. If you let Energy drop, it STAYS dropped.
    // This is what creates the "every choice matters" tension that makes it addictive.

    // ARR growth — startup trajectory. Perfect play should reach ~$25-30M by week 24.
    // IPO requires $30M ARR + week 20+. This should be RARE — only the best runs achieve it.
    // Growth is LINEAR (additive), not compound. Made harder: higher thresholds, lower probabilities.
    const newWeek = week + 1;
    const act = getAct(newWeek);
    let arrDelta: number;
    if (act === 1) {
      // Early stage: finding product-market fit. Slow, uncertain. Most weeks = zero.
      if (newDims.company >= 55) arrDelta = Math.random() < 0.5 ? 1 : 0;
      else if (newDims.company >= 40) arrDelta = Math.random() < 0.2 ? 1 : 0;
      else arrDelta = 0;
    } else if (act === 2) {
      // Growth stage: +1-2/week only if company is STRONG. Mediocre company = stagnation.
      if (newDims.company >= 60) arrDelta = Math.random() < 0.7 ? 2 : 1;
      else if (newDims.company >= 45) arrDelta = Math.random() < 0.5 ? 1 : 0;
      else if (newDims.company >= 30) arrDelta = Math.random() < 0.2 ? 1 : 0;
      else arrDelta = Math.random() < 0.4 ? -1 : 0; // Shrinking faster if company is dying
    } else {
      // Late stage: +2-3/week ONLY at peak. Penalty zone is wider.
      if (newDims.company >= 60) arrDelta = Math.random() < 0.6 ? 3 : 2;
      else if (newDims.company >= 45) arrDelta = Math.random() < 0.5 ? 2 : 1;
      else if (newDims.company >= 30) arrDelta = Math.random() < 0.3 ? 1 : 0;
      else arrDelta = Math.random() < 0.5 ? -2 : -1; // Company is failing, ARR shrinks fast
    }
    const newArr = Math.max(0, arr + arrDelta);

    // Cash burn — real startup economics. $2.5M seed, ~$100K/week base.
    // Burn scales with growth: more ARR = more headcount = more burn.
    // Revenue = ARR / 52 weeks/year. ARR is in $M, cash is in $K.
    const baseBurn = 100; // $100K/week base (rent, core team, infra) — up from 80K, more realistic
    const growthBurn = Math.floor(newArr * 8); // each $1M ARR adds ~$8K/week burn (more aggressive hiring)
    const weeklyBurn = baseBurn + growthBurn;
    const weeklyRevenue = Math.floor(newArr * 1000 / 52); // correct: ARR / 52 weeks
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

    const decision: Decision = { week, context: tension?.context || "Custom move", choice, dims: { ...newDims }, isCustom: isCustom || showAsCustom };
    const newDecisions = [...decisions, decision];
    setDecisions(newDecisions);

    // Log week color — based on net impact of this choice, not absolute state
    const delta = (newDims.company - dims.company) + (newDims.relationships - dims.relationships) + (newDims.energy - dims.energy) + (newDims.integrity - dims.integrity);
    let weekColor: string;
    if (delta >= 10) weekColor = "🟩";       // Great week — net positive
    else if (delta >= 0) weekColor = "🟨";    // Neutral/slight gain
    else if (delta >= -10) weekColor = "🟥";  // Tough week — net negative
    else weekColor = "💀";                    // Brutal week — big losses
    if (newArr > arr + 15) weekColor = "🏆"; // Revenue milestone overrides
    const newWeekLog = [...weekLog, weekColor];
    setWeekLog(newWeekLog);

    // Track high-impact choices as pivotal moments for the scorecard
    if (Math.abs(delta) >= 10) {
      if (isCustom || showAsCustom) {
        // Custom choices: contextualize the raw text with the situation
        const briefContext = (tension?.context || "").split('.')[0] || "A critical moment";
        setPivotalMoments(prev => [...prev.slice(-4), `Week ${week}: ${choice.length > 30 ? choice.slice(0, 27) + '...' : choice} — ${briefContext.toLowerCase()}`]);
      } else if (tension) {
        // Preset choices: describe the tradeoff they made
        const dimLabelsP: Record<string, string> = { company: 'the product', relationships: 'people', energy: 'energy', integrity: 'ethics' };
        const dimKeysP: (keyof GameDimensions)[] = ['company', 'relationships', 'energy', 'integrity'];
        let biggest: keyof GameDimensions = 'company';
        let biggestVal = 0;
        for (const k of dimKeysP) {
          const v = Math.abs(newDims[k] - dims[k]);
          if (v > biggestVal) { biggestVal = v; biggest = k; }
        }
        const dir = (newDims[biggest] - dims[biggest]) > 0 ? 'Chose' : 'Sacrificed';
        setPivotalMoments(prev => [...prev.slice(-4), `Week ${week}: ${dir} ${dimLabelsP[biggest]}`]);
      }
    }

    // Detect character departures from choices (preset "Let him go" OR custom "Fire him", "Fire Marcus", etc.)
    const choiceLower = choice.toLowerCase();
    const contextLower = (tension?.context || customText).toLowerCase();
    const mentionsMarcus = contextLower.includes('marcus') || choiceLower.includes('marcus');
    const mentionsElena = contextLower.includes('elena') || choiceLower.includes('elena');
    const firingIntent = /\b(fire|fired|let .* go|terminate|get rid of|remove|kick out|sack)\b/i.test(choiceLower);
    if (firingIntent && mentionsMarcus && !usedEvents.has('marcus_leaves')) {
      setUsedEvents(prev => new Set([...prev, 'marcus_leaves']));
    }
    if (firingIntent && mentionsElena && !usedEvents.has('elena_quit')) {
      setUsedEvents(prev => new Set([...prev, 'elena_quit']));
    }
    // Also mark "Let him go" preset choice as Marcus departure (context always mentions Marcus)
    if (choice === 'Let him go' && mentionsMarcus && !usedEvents.has('marcus_leaves')) {
      setUsedEvents(prev => new Set([...prev, 'marcus_leaves']));
    }

    // Build list of departed characters for AI narrative continuity
    const departed: string[] = [];
    if (usedEvents.has('elena_quit') || (firingIntent && mentionsElena)) departed.push('Elena');
    if (usedEvents.has('marcus_leaves') || (firingIntent && mentionsMarcus)) departed.push('Marcus');

    // Determine unchosen option and effects for narrative context
    const isLeftChoice = tension ? choice === tension.left : false;
    const unchosenOption = tension
      ? (isLeftChoice ? tension.right : tension.left)
      : undefined;
    const chosenEffects = tension
      ? (isLeftChoice ? tension.leftEffect : tension.rightEffect)
      : undefined;
    const unchosenEffects = tension
      ? (isLeftChoice ? tension.rightEffect : tension.leftEffect)
      : undefined;

    // Generate narrative — AI now knows both options and the tradeoff
    const narrativeText = await generateNarrative(
      tension?.context || customText,
      choice, newDims, week, companyName,
      departed.length > 0 ? departed : undefined,
      unchosenOption, chosenEffects, unchosenEffects, tension?.category,
    );

    // Enforce narrative brevity — 2 sentences max, 35 words max. A flash, not a paragraph.
    const sentences = narrativeText.match(/[^.!?]+[.!?]+/g) || [narrativeText];
    let truncated = sentences.slice(0, 2).join(' ').trim();
    const words = truncated.split(/\s+/);
    if (words.length > 35) truncated = words.slice(0, 35).join(' ') + '.';
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
      const skipWeeks = Math.min(1 + Math.floor(Math.random() * 2), Math.max(0, 24 - newWeek));
      if (skipWeeks > 0) {
        pendingContinueRef.current = () => {
          setWaitingForTap(false);
          setNarrative(null);
          setCompressing(true);
          setCompressWeeks(skipWeeks);
          setCompressMoment(getCompressionLine(newDims, newWeek, newArr, usedEvents));
          addTimeout(() => {
            const burnPerWeek = 80 + Math.floor(newArr * 6);
            const revPerWeek = Math.floor(newArr * 1000 / 52);
            const compressedCash = Math.max(0, newCash + skipWeeks * (revPerWeek - burnPerWeek));
            // Compression ARR: additive, matching the linear growth model. +1/week if healthy.
            const compArrPerWeek = newDims.company >= 50 ? 1 : newDims.company >= 35 ? 0.5 : -0.5;
            const compressedArr = Math.max(0, Math.round(newArr + compArrPerWeek * skipWeeks));
            const compressedWeek = newWeek + skipWeeks;

            // Drift: time passes and things decay without your attention.
            // Softened — neglect still matters but a skip-week alone won't kill you.
            const driftDims = { ...newDims };
            driftDims.relationships = Math.max(0, driftDims.relationships - skipWeeks);
            driftDims.energy = Math.max(0, driftDims.energy - skipWeeks);
            driftDims.company = Math.max(0, driftDims.company - Math.ceil(skipWeeks * 0.5));
            driftDims.integrity = Math.max(0, driftDims.integrity - Math.ceil(skipWeeks * 0.5));
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

    // Auto-advance: narrative holds based on word count, then transitions.
    // No "tap to continue" — the story pulls you forward. Still tappable for impatient players.
    const wordCount = truncated.split(/\s+/).length;
    const readingMs = Math.max(2200, Math.min(wordCount * 80, 5000)); // 80ms/word, clamped 2.2-5s
    const baseDelay = isConsequence ? readingMs + 800 : readingMs;
    addTimeout(() => setWaitingForTap(true), baseDelay);
    // Auto-continue after an additional pause — the player never has to tap
    addTimeout(() => {
      if (pendingContinueRef.current) {
        pendingContinueRef.current();
        pendingContinueRef.current = null;
      }
    }, baseDelay + 2500);
  };

  const handleContinue = () => {
    if (pendingContinueRef.current) {
      pendingContinueRef.current();
      pendingContinueRef.current = null;
    }
  };

  const handleCustomSubmit = async () => {
    if (!customText.trim()) return;
    const text = customText.trim();
    // Try AI evaluation first — rewards creativity, penalizes laziness
    try {
      const aiEffects = await evaluateCustomChoice(
        text, tension?.context || text, dims, week, companyName
      );
      // AI returned real effects + verdict — showAsCustom=true so player sees impact feedback
      handleChoice(text, aiEffects as Partial<GameDimensions>, false, true, aiEffects.verdict);
    } catch {
      // Fallback to random if AI fails
      handleChoice(text, {}, true);
    }
  };

  // Is the tension screen active (not loading, no narrative, no overlay)?
  const showTension = !!tension && !loading && !narrative && !compressing && !surpriseEvent && !milestone && !showBreathing && !peakMoment;

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

  // Scroll custom input into view when mobile keyboard opens
  useEffect(() => {
    if (showCustom && customInputRef.current) {
      // Small delay lets the keyboard open before scrolling
      const id = setTimeout(() => {
        customInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
      return () => clearTimeout(id);
    }
  }, [showCustom]);

  return (
    <SceneBackground sceneKey={sceneKey} mood={liveMood}>
      <div style={{
        maxWidth: 520, margin: "0 auto",
        padding: "max(24px, env(safe-area-inset-top, 0px)) max(20px, env(safe-area-inset-right, 0px)) max(24px, env(safe-area-inset-bottom, 0px)) max(20px, env(safe-area-inset-left, 0px))",
        fontFamily: FONTS.body, minHeight: "100dvh",
        display: "flex", flexDirection: "column",
      }}>

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
                }}>{cash >= 1000 ? `$${(cash / 1000).toFixed(1)}M` : `$${cash}K`} cash</div>
              </div>
            </div>

            {/* Four dimensions — green = good, yellow = rough, red = crisis */}
            <div style={{ opacity: viz.dims, transition: "opacity 2s ease" }}>
              <DimBar label="Company" value={dims.company} hideValue={!viz.dimValues} />
              <DimBar label="People" value={dims.relationships} hideValue={!viz.dimValues} />
              <DimBar label="Energy" value={dims.energy} hideValue={!viz.dimValues} />
              <DimBar label="Ethics" value={dims.integrity} hideValue={!viz.dimValues} />
              {/* First-week hint: teach the player what kills them */}
              {week === 1 && (
                <div style={{
                  marginTop: 8,
                  fontSize: 10,
                  fontFamily: FONTS.mono,
                  color: "rgba(255,255,255,0.2)",
                  letterSpacing: "0.5px",
                  textAlign: "center",
                  lineHeight: 1.7,
                  animation: "fadeUp 1s ease 2s forwards",
                  opacity: 0,
                }}>
                  If any bar hits zero, the game ends.
                </div>
              )}
            </div>

            {/* Week-by-week progress bar — tap a dot to revisit the choice, last dot pulses */}
            {weekLog.length > 0 && (
              <div style={{
                marginTop: 14, paddingTop: 14,
                borderTop: "1px solid rgba(255,255,255,0.04)",
              }}>
                <div style={{
                  display: "flex", gap: 2,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}>
                  {weekLog.map((color, i) => {
                    const isSelected = selectedDot === i;
                    const isLast = i === weekLog.length - 1;
                    const dotColor = color === "🟩" ? "rgba(74,222,128,0.6)"
                      : color === "🟨" ? "rgba(250,204,21,0.6)"
                      : color === "🟥" ? "rgba(248,113,113,0.6)"
                      : color === "💀" ? "rgba(248,113,113,0.9)"
                      : color === "🏆" ? "rgba(74,222,128,0.9)"
                      : "rgba(255,255,255,0.1)";
                    return (
                      <div
                        key={i}
                        onClick={() => setSelectedDot(isSelected ? null : i)}
                        style={{
                          width: 8, height: 8, borderRadius: 2,
                          background: dotColor,
                          cursor: "pointer",
                          transform: isSelected ? "scale(1.6)" : "scale(1)",
                          boxShadow: isSelected ? `0 0 8px ${dotColor}` : "none",
                          transition: "transform 0.2s ease, box-shadow 0.2s ease",
                          animation: isLast ? "pulse 1.5s ease-in-out infinite" : undefined,
                        }}
                      />
                    );
                  })}
                  {/* Empty slots for remaining weeks */}
                  {Array.from({ length: Math.max(0, 24 - weekLog.length) }, (_, i) => (
                    <div key={`empty-${i}`} style={{
                      width: 8, height: 8, borderRadius: 2,
                      background: "rgba(255,255,255,0.04)",
                    }} />
                  ))}
                </div>
                {/* Selected dot detail — what happened that week */}
                {selectedDot !== null && decisions[selectedDot] && (
                  <div
                    onClick={() => setSelectedDot(null)}
                    style={{
                      marginTop: 10,
                      padding: "8px 12px",
                      background: "rgba(255,255,255,0.03)",
                      borderRadius: 8,
                      border: "1px solid rgba(255,255,255,0.06)",
                      cursor: "pointer",
                      animation: "fadeUp 0.3s ease",
                    }}
                  >
                    <div style={{
                      fontSize: 9,
                      color: "rgba(255,255,255,0.3)",
                      fontFamily: FONTS.mono,
                      letterSpacing: "1px",
                      marginBottom: 4,
                    }}>
                      WEEK {decisions[selectedDot].week}
                    </div>
                    <div style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.5)",
                      fontFamily: FONTS.body,
                      lineHeight: 1.4,
                    }}>
                      {decisions[selectedDot].context.length > 60
                        ? decisions[selectedDot].context.slice(0, 60) + "…"
                        : decisions[selectedDot].context}
                    </div>
                    <div style={{
                      fontSize: 11,
                      color: "rgba(255,238,210,0.6)",
                      fontFamily: FONTS.mono,
                      marginTop: 3,
                    }}>
                      → {decisions[selectedDot].choice}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          );
        })()}

        {/* Critical warnings — tell the player exactly what will kill them */}
        {!compressing && !surpriseEvent && !isFourthWall && (() => {
          const warnings: { text: string; urgent: boolean }[] = [];
          if (dims.energy <= 25 && dims.energy > 0) {
            warnings.push({
              text: dims.energy <= 10 ? "Energy at zero = burnout. This is your last chance." : "Energy is dropping — if it hits zero, you burn out",
              urgent: dims.energy <= 10,
            });
          }
          if (dims.integrity <= 25 && dims.integrity > 0) {
            warnings.push({
              text: dims.integrity <= 10 ? "Ethics at zero = disgrace. One more bad call." : "Ethics are slipping — zero means disgrace",
              urgent: dims.integrity <= 10,
            });
          }
          if (dims.relationships <= 20) {
            warnings.push({
              text: dims.relationships <= 10 ? "The board is meeting without you." : "People are losing faith — the board is watching",
              urgent: dims.relationships <= 10,
            });
          }
          if (cash <= 400 && cash > 0) {
            warnings.push({
              text: cash <= 150 ? "Cash at zero = bankrupt. Weeks left: maybe one." : "Cash is running low — $0 means bankruptcy",
              urgent: cash <= 150,
            });
          }
          if (warnings.length === 0) return null;
          return (
            <div style={{
              textAlign: "center", marginBottom: 12, marginTop: -16,
              padding: "8px 16px",
              background: "rgba(248,113,113,0.04)",
              borderRadius: 8,
              animation: warnings.some(w => w.urgent) ? "pulse 1.5s ease-in-out infinite" : "fadeUp 0.5s ease",
            }}>
              {warnings.map((w, i) => (
                <div key={i} style={{
                  fontSize: 11, fontFamily: FONTS.mono,
                  color: w.urgent ? "rgba(248,113,113,0.95)" : "rgba(248,113,113,0.65)",
                  letterSpacing: "0.3px",
                  marginBottom: 3,
                  fontWeight: w.urgent ? 600 : 400,
                }}>{w.text}</div>
              ))}
            </div>
          );
        })()}

        {/* Act 3 urgency — "X weeks left" when the end is near */}
        {!compressing && !surpriseEvent && !isFourthWall && week >= 18 && week <= 24 && (
          <div style={{
            textAlign: "center",
            marginBottom: 16,
            marginTop: -12,
            animation: week >= 22 ? "pulse 2s ease-in-out infinite" : "fadeUp 0.5s ease",
          }}>
            <span style={{
              fontSize: 11,
              fontFamily: FONTS.mono,
              color: week >= 22 ? "rgba(248,113,113,0.7)" : "rgba(248,160,100,0.5)",
              letterSpacing: "1px",
            }}>
              {24 - week} week{24 - week !== 1 ? "s" : ""} left
            </span>
          </div>
        )}

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

        {/* Peak moment — Kahneman peak-end rule: one designed emotional peak in Act 2 */}
        {peakMoment && (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            minHeight: "60dvh",
            padding: "0 32px",
            animation: "fadeUp 2s ease",
          }}>
            <div style={{
              fontFamily: FONTS.display,
              fontSize: "clamp(20px, 5vw, 28px)",
              color: "rgba(255,238,220,0.55)",
              fontStyle: "italic",
              lineHeight: 1.7,
              textAlign: "center",
              maxWidth: 340,
              fontWeight: 300,
            }}>
              {peakMoment}
            </div>
            <div style={{
              marginTop: 32,
              width: 24, height: 1,
              background: "rgba(255,255,255,0.08)",
              animation: "pulse 3s ease-in-out infinite",
            }} />
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

        {/* Narrative flash — short, visual, auto-advances. Tap anywhere to skip. */}
        {narrative && !showBreathing && !compressing && (
          <div
            onClick={handleContinue}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleContinue(); } }}
            role="button"
            tabIndex={0}
            aria-label="Continue to next week"
            style={{
              padding: "20px 8px", marginBottom: 20,
              animation: "fadeUp 0.5s ease",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            <div style={{
              fontSize: "clamp(15px, 3.5vw, 17px)",
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.8,
              fontFamily: FONTS.display,
              fontStyle: "italic",
              fontWeight: 300,
              maxWidth: 380,
              margin: "0 auto",
            }}>
              {narrative}
            </div>
            {/* Custom choice feedback — show what the AI decided your move did */}
            {customOutcome && customOutcome.wasCustom && (
              <div style={{
                marginTop: 20, paddingTop: 16,
                borderTop: "1px solid rgba(255,238,210,0.08)",
                opacity: 0, animation: "fadeUp 0.6s ease 0.5s forwards",
              }}>
                <div style={{
                  fontSize: 10,
                  color: "rgba(255,238,210,0.35)",
                  fontFamily: FONTS.mono,
                  letterSpacing: "1.5px",
                  marginBottom: 10,
                  textAlign: "center",
                }}>
                  YOUR MOVE
                </div>
                {/* AI verdict — one-liner judgment of the player's creative input */}
                {customOutcome.verdict && (
                  <div style={{
                    fontSize: 14,
                    color: "rgba(255,238,210,0.7)",
                    fontStyle: "italic",
                    fontFamily: FONTS.display,
                    textAlign: "center",
                    marginBottom: 12,
                    lineHeight: 1.6,
                    fontWeight: 400,
                  }}>
                    &ldquo;{customOutcome.verdict}&rdquo;
                  </div>
                )}
                <div style={{
                  display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap",
                }}>
                  {([
                    { key: "company" as const, label: "Company" },
                    { key: "relationships" as const, label: "People" },
                    { key: "energy" as const, label: "Energy" },
                    { key: "integrity" as const, label: "Ethics" },
                  ]).map(({ key, label }) => {
                    const val = customOutcome.effects[key] || 0;
                    if (val === 0) return null;
                    return (
                      <span key={key} style={{
                        fontSize: 12,
                        fontFamily: FONTS.mono,
                        fontWeight: 600,
                        color: val > 0 ? "rgba(74,222,128,0.7)" : "rgba(248,113,113,0.7)",
                        letterSpacing: "0.3px",
                      }}>
                        {label} {val > 0 ? `+${val}` : val}
                      </span>
                    );
                  })}
                </div>
                {/* Net impact summary — one sentence on what just happened */}
                {(() => {
                  const efx = customOutcome.effects;
                  const total = (efx.company || 0) + (efx.relationships || 0) + (efx.energy || 0) + (efx.integrity || 0);
                  const dimKeys: (keyof GameDimensions)[] = ['company', 'relationships', 'energy', 'integrity'];
                  const dimLabels: Record<string, string> = { company: 'the company', relationships: 'your people', energy: 'your energy', integrity: 'your reputation' };
                  const biggest = dimKeys.reduce((a, b) => Math.abs(efx[a] || 0) > Math.abs(efx[b] || 0) ? a : b);
                  const bigVal = efx[biggest] || 0;
                  if (Math.abs(bigVal) < 3) return null;
                  const impact = bigVal > 0
                    ? `That helped ${dimLabels[biggest]}.`
                    : `That hurt ${dimLabels[biggest]}.`;
                  return (
                    <div style={{
                      marginTop: 10,
                      fontSize: 11,
                      color: "rgba(255,255,255,0.25)",
                      fontFamily: FONTS.mono,
                      textAlign: "center",
                      letterSpacing: "0.3px",
                    }}>
                      {impact}{total < -10 ? " Everything has a cost." : total > 10 ? " Bold move." : ""}
                    </div>
                  );
                })()}
              </div>
            )}
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
            {/* Subtle progress indicator — a thin line that fills as auto-advance approaches */}
            {waitingForTap && (
              <div style={{
                marginTop: 16,
                height: 1,
                background: "rgba(255,255,255,0.04)",
                borderRadius: 1,
                overflow: "hidden",
              }}>
                <div style={{
                  height: "100%",
                  background: "rgba(255,238,210,0.15)",
                  animation: "fillLine 2.5s linear forwards",
                }} />
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
                ].map((opt, i) => (
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
                    </button>
                  ))}
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
              <div style={{ marginTop: 8, paddingBottom: 200, animation: "fadeUp 0.4s ease" }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    ref={customInputRef}
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
