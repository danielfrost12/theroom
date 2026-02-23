import { GameDimensions, Ending, IndexedTension, Decision, TensionEffect } from './types';
import { TENSIONS, BREATHING_MOMENTS, COMPRESSION_LINES } from './constants';
import type { PlayRecord } from './stats';

// --- 3-ACT STRUCTURE ---
// 24 weeks. Each decision is ~4% of the game. You feel every one.
// Act 1: The Honeymoon (weeks 1-7) — optimism, building, early wins
// Act 2: The Grind (weeks 8-17) — cracks show, fatigue, harder choices
// Act 3: The Reckoning (weeks 18-24) — legacy, cost, what it meant

export const TOTAL_WEEKS = 24;

export type Act = 1 | 2 | 3;

export function getAct(week: number): Act {
  if (week <= 7) return 1;
  if (week <= 17) return 2;
  return 3;
}

// --- ARCHETYPE DETECTION ---
// Your pattern of choices reveals who you are as a leader.

export type Archetype =
  | 'The Visionary'    // high company, low relationships
  | 'The Shepherd'     // high relationships, high integrity
  | 'The Survivor'     // low everything but lasted 40+ weeks
  | 'The Purist'       // high integrity, low company
  | 'The Operator'     // balanced dims, high ARR
  | 'The Burnout'      // high company, zero energy
  | 'The Maverick';    // wild swings, many extreme choices

export function detectArchetype(dims: GameDimensions, decisions: Decision[], weeks: number): Archetype {
  const { company, relationships, energy, integrity } = dims;
  const avg = (company + relationships + energy + integrity) / 4;
  const spread = Math.max(company, relationships, energy, integrity) - Math.min(company, relationships, energy, integrity);

  // Score each archetype
  const scores: Record<Archetype, number> = {
    'The Visionary': 0,
    'The Shepherd': 0,
    'The Survivor': 0,
    'The Purist': 0,
    'The Operator': 0,
    'The Burnout': 0,
    'The Maverick': 0,
  };

  // The Visionary: high company, sacrificed relationships
  if (company > 55) scores['The Visionary'] += 3;
  if (company > 70) scores['The Visionary'] += 3;
  if (relationships < 40) scores['The Visionary'] += 2;
  if (company - relationships > 25) scores['The Visionary'] += 3;

  // The Shepherd: prioritized people + integrity
  if (relationships > 55) scores['The Shepherd'] += 3;
  if (integrity > 55) scores['The Shepherd'] += 3;
  if (relationships > 65 && integrity > 50) scores['The Shepherd'] += 3;
  if (company < 40 && relationships > 50) scores['The Shepherd'] += 2;

  // The Survivor: lasted long despite mediocre stats
  if (weeks >= 20 && avg < 50) scores['The Survivor'] += 6;
  if (weeks >= 15 && avg < 45) scores['The Survivor'] += 4;
  if (weeks >= 10 && Math.min(company, relationships, energy, integrity) > 15) scores['The Survivor'] += 2;

  // The Purist: high integrity, wouldn't compromise
  if (integrity > 60) scores['The Purist'] += 3;
  if (integrity > 75) scores['The Purist'] += 3;
  if (integrity - company > 20) scores['The Purist'] += 3;
  if (company < 35 && integrity > 55) scores['The Purist'] += 2;

  // The Operator: balanced, high performance
  if (spread < 20 && avg > 50) scores['The Operator'] += 5;
  if (spread < 15) scores['The Operator'] += 3;
  if (avg > 55 && spread < 25) scores['The Operator'] += 3;

  // The Burnout: drove company forward at personal cost
  if (company > 50 && energy < 25) scores['The Burnout'] += 5;
  if (company > 40 && energy < 35) scores['The Burnout'] += 3;
  if (energy < 20) scores['The Burnout'] += 2;

  // The Maverick: wild decision swings — measure from decision history
  if (decisions.length >= 5) {
    let swings = 0;
    for (let i = 1; i < decisions.length; i++) {
      const prev = decisions[i - 1].dims;
      const curr = decisions[i].dims;
      const delta = Math.abs(curr.company - prev.company) + Math.abs(curr.relationships - prev.relationships) +
                    Math.abs(curr.energy - prev.energy) + Math.abs(curr.integrity - prev.integrity);
      if (delta > 30) swings++;
    }
    if (swings > decisions.length * 0.4) scores['The Maverick'] += 5;
    if (swings > decisions.length * 0.3) scores['The Maverick'] += 3;
    if (spread > 35) scores['The Maverick'] += 2;
  }

  // Return highest scoring archetype
  let best: Archetype = 'The Operator';
  let bestScore = 0;
  for (const [archetype, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      best = archetype as Archetype;
    }
  }
  return best;
}

// Mid-game mirror — the game calls you out on your pattern
// Only surfaces in Act 2+, one per archetype detection cycle
export function getArchetypeMirror(archetype: Archetype, week: number): string | null {
  const act = getAct(week);
  if (act === 1) return null; // Too early — you're still learning

  switch (archetype) {
    case 'The Visionary':
      return act === 2
        ? "You keep choosing the company. Every time. Have you noticed?"
        : "The product is everything to you. The people are starting to feel it.";
    case 'The Shepherd':
      return act === 2
        ? "You protect everyone but yourself. The numbers don't lie."
        : "Everyone loves you. The board doesn't care about that.";
    case 'The Survivor':
      return act === 2
        ? "You're still here. That's something. Is it enough?"
        : "Surviving isn't winning. But you already knew that.";
    case 'The Purist':
      return act === 2
        ? "You've never compromised. The company has paid for it every time."
        : "Your integrity is intact. Your runway isn't.";
    case 'The Operator':
      return act === 2
        ? "Balanced. Measured. Controlled. When was the last time you felt something?"
        : "You've managed everything perfectly. Nobody can tell what you actually believe.";
    case 'The Burnout':
      return act === 2
        ? "You keep giving. Your body is keeping score."
        : "The company is alive because you're dying. Is that a trade-off or a confession?";
    case 'The Maverick':
      return act === 2
        ? "You've zigged every time they expected a zag. The team is dizzy."
        : "Bold moves. Wild swings. Nobody knows what you'll do next. Including you.";
    default:
      return null;
  }
}

// Archetype-based tension bias — nudge tension selection toward the player's weakness
export function getArchetypeBias(archetype: Archetype): Record<string, number> {
  // Returns category score bonuses for tension selection
  switch (archetype) {
    case 'The Visionary':
      return { people: 3, life: 2 };         // force them to face what they ignore
    case 'The Shepherd':
      return { product: 3, strategy: 2 };     // push growth dilemmas
    case 'The Survivor':
      return { values: 2, strategy: 2 };      // test if survival has a cost
    case 'The Purist':
      return { product: 3, strategy: 3 };     // force practical trade-offs
    case 'The Operator':
      return { values: 3, intimate: 2 };      // challenge the balanced player emotionally
    case 'The Burnout':
      return { life: 3, people: 2 };          // force them to confront the cost
    case 'The Maverick':
      return { values: 3, people: 2 };        // test consistency
    default:
      return {};
  }
}

// --- SURPRISE EVENTS ---
// These happen TO the player. No choice. The world moved without you.
// Each has a condition, a message, and dim effects.
export interface SurpriseEvent {
  message: string;
  subtext: string;
  effects: Partial<GameDimensions>;
  cashEffect?: number;
  arrEffect?: number;
  condition: (state: { week: number; dims: GameDimensions; cash: number; arr: number; pastChoices: string[] }) => boolean;
  once?: string; // unique key — only fires once per game
}

export const SURPRISE_EVENTS: SurpriseEvent[] = [
  // Positive surprises — reward for good play
  {
    message: "A tweet about your product went viral overnight.",
    subtext: "1,200 signups before coffee.",
    effects: { company: 8, energy: 5 },
    arrEffect: 3,
    condition: ({ dims, week }) => week >= 3 && dims.company > 55,
    once: "viral_tweet",
  },
  {
    message: "Elena closed the biggest deal of the quarter.",
    subtext: "She didn't even tell you. You found out from the CRM.",
    effects: { company: 5, relationships: 5, energy: 3 },
    arrEffect: 5,
    condition: ({ dims, week }) => week >= 5 && dims.relationships > 50 && dims.company > 40,
    once: "elena_deal",
  },
  {
    message: "Your engineer shipped a feature on a Sunday. Because she wanted to.",
    subtext: "Morale isn't measured. It's felt.",
    effects: { company: 6, relationships: 4, energy: 3, integrity: 2 },
    condition: ({ dims }) => dims.energy > 55 && dims.relationships > 55,
    once: "sunday_ship",
  },

  // Negative surprises — the world doesn't wait
  {
    message: "Elena resigned.",
    subtext: "Her email was two sentences. She thanked no one.",
    effects: { company: -8, relationships: -10, energy: -5 },
    condition: ({ dims, week }) => week >= 4 && dims.energy < 30 && dims.relationships < 40,
    once: "elena_quit",
  },
  {
    message: "Your biggest client churned. No warning.",
    subtext: "They switched to the competitor you ignored.",
    effects: { company: -10, relationships: -3 },
    arrEffect: -8,
    condition: ({ dims, week }) => week >= 6 && dims.company < 35,
    once: "client_churn",
  },
  {
    message: "David forwarded your last investor update to someone you've never met.",
    subtext: "His assistant said it was 'routine.'",
    effects: { relationships: -5, integrity: -3 },
    condition: ({ dims, week, pastChoices }) => week >= 5 && pastChoices.includes("Buy yourself a quarter") && dims.integrity < 45,
    once: "david_forward",
  },
  {
    message: "A Glassdoor review appeared. One star.",
    subtext: "\"Leadership is checked out. We're building a ghost ship.\"",
    effects: { relationships: -8, company: -3, energy: -3 },
    condition: ({ dims, week }) => week >= 7 && dims.relationships < 30,
    once: "glassdoor",
  },
  {
    message: "Marcus submitted a two-week notice.",
    subtext: "He's going to the competitor.",
    effects: { company: -12, relationships: -8, energy: -5 },
    condition: ({ dims, week, pastChoices }) => week >= 5 && pastChoices.includes("Let him go") && dims.relationships < 35,
    once: "marcus_leaves",
  },

  // Neutral/dramatic — inflection points
  {
    message: "TechCrunch mentioned you in a roundup.",
    subtext: "Paragraph three. Your name was spelled wrong.",
    effects: { company: 3 },
    condition: ({ week, dims }) => week >= 4 && dims.company > 45,
    once: "techcrunch",
  },
  {
    message: "A co-founder you admire DM'd you on Twitter.",
    subtext: "\"Saw your product. Impressive. Let's talk.\"",
    effects: { energy: 8, company: 3, relationships: 3 },
    condition: ({ week, dims }) => week >= 8 && dims.company > 50 && dims.integrity > 50,
    once: "founder_dm",
  },
];

// Check if a surprise event should fire this week
export function checkSurpriseEvent(
  state: { week: number; dims: GameDimensions; cash: number; arr: number; pastChoices: string[] },
  usedEvents: Set<string>
): SurpriseEvent | null {
  // Only ~25% chance each eligible week — surprise events should be rare
  if (Math.random() > 0.25) return null;

  const eligible = SURPRISE_EVENTS.filter(e => {
    if (e.once && usedEvents.has(e.once)) return false;
    return e.condition(state);
  });

  if (eligible.length === 0) return null;
  return eligible[Math.floor(Math.random() * eligible.length)];
}

// --- MILESTONES ---
// Positive feedback moments — the game acknowledges your survival/success
export interface Milestone {
  message: string;
  subtext: string;
  condition: (state: { week: number; dims: GameDimensions; arr: number; cash: number }) => boolean;
  once: string;
}

export const MILESTONES: Milestone[] = [
  {
    message: "Your first real revenue.",
    subtext: "Not a lot. But it's real. Someone paid for what you built.",
    condition: ({ arr }) => arr >= 1,
    once: "first_revenue",
  },
  {
    message: "$5M ARR.",
    subtext: "The team celebrated with cheap champagne. Someone cried.",
    condition: ({ arr }) => arr >= 5,
    once: "arr_5",
  },
  {
    message: "$10M ARR.",
    subtext: "David called to congratulate you. First time he's called just to say 'well done.'",
    condition: ({ arr }) => arr >= 10,
    once: "arr_10",
  },
  {
    message: "$25M ARR.",
    subtext: "The office is different now. Bigger. Quieter. More strangers.",
    condition: ({ arr }) => arr >= 25,
    once: "arr_25",
  },
  {
    message: "You survived the honeymoon.",
    subtext: "7 weeks. 7 decisions. Now the real game starts.",
    condition: ({ week }) => week >= 8,
    once: "quarter",
  },
  {
    message: "Halfway.",
    subtext: "12 weeks in. Most founders don't make it this far.",
    condition: ({ week }) => week >= 12,
    once: "half_year",
  },
  {
    message: "Everyone's still here.",
    subtext: "No one quit this month. That's rarer than you think.",
    condition: ({ dims, week }) => week >= 8 && dims.relationships > 60 && dims.energy > 50,
    once: "no_quit",
  },
  {
    message: "You're profitable.",
    subtext: "Revenue exceeds burn. For the first time, the clock stopped ticking.",
    condition: ({ arr }) => arr >= 8,
    once: "profitable",
  },
];

export function checkMilestone(
  state: { week: number; dims: GameDimensions; arr: number; cash: number },
  usedMilestones: Set<string>
): Milestone | null {
  for (const m of MILESTONES) {
    if (usedMilestones.has(m.once)) continue;
    if (m.condition(state)) return m;
  }
  return null;
}

// --- TENSION STAKES ---
// Classify how high-stakes a tension is — affects visual presentation
export type TensionStakes = 'low' | 'medium' | 'high' | 'critical';

export function getTensionStakes(t: IndexedTension, dims: GameDimensions): TensionStakes {
  // Consequence tensions are always high
  if (t.requires) return 'critical';

  // Check if any effect could push a weak dimension to danger
  const weakest = Math.min(dims.company, dims.relationships, dims.energy, dims.integrity);
  const maxNegLeft = Math.min(t.leftEffect.company, t.leftEffect.relationships, t.leftEffect.energy, t.leftEffect.integrity);
  const maxNegRight = Math.min(t.rightEffect.company, t.rightEffect.relationships, t.rightEffect.energy, t.rightEffect.integrity);
  const worstHit = Math.min(maxNegLeft, maxNegRight);

  if (weakest < 25 && worstHit < -10) return 'critical';
  if (weakest < 35 || worstHit < -15) return 'high';
  if (worstHit < -10) return 'medium';
  return 'low';
}

export function getSceneForState(dims: GameDimensions, week: number): string {
  const act = getAct(week);

  // Crisis overrides — these always win regardless of act
  if (dims.energy < 25) return "apartment_night";
  if (dims.integrity < 25) return "bar";
  if (dims.relationships < 30) return "park_bench";

  // Success overrides
  if (dims.company > 75 && dims.energy > 60) return "coworking";

  // Act-specific scene cycles — the world around you shifts
  if (act === 1) {
    // Honeymoon: bright, energetic spaces
    const cycle = week % 4;
    if (cycle === 0) return "office_morning";
    if (cycle === 1) return "coffee_shop";
    if (cycle === 2) return "coworking";
    return "elevator";
  }

  if (act === 2) {
    // The Grind: darker, more enclosed, pressure mounting
    const cycle = week % 5;
    if (cycle === 0) return "office_night";
    if (cycle === 1) return "boardroom";
    if (cycle === 2) return "coffee_shop";
    if (cycle === 3) return "elevator";
    return "office_morning";
  }

  // Act 3: The Reckoning — reflective, final spaces
  const cycle = week % 4;
  if (cycle === 0) return "rooftop";
  if (cycle === 1) return "boardroom";
  if (cycle === 2) return "office_night";
  return "apartment_night";
}

export function getBreathingMoment(dims: GameDimensions, week?: number): string {
  const avg = (dims.company + dims.relationships + dims.energy + dims.integrity) / 4;
  const act = week ? getAct(week) : 1;

  // Act coloring: same dim pools but weighted differently
  let pool: string[];
  if (act === 3) {
    // Reckoning: even "good" moments feel heavy
    if (avg > 60) pool = BREATHING_MOMENTS.neutral;
    else if (avg > 40) pool = BREATHING_MOMENTS.bad;
    else pool = BREATHING_MOMENTS.crisis;
  } else if (act === 2) {
    // Grind: threshold drops — optimism fades faster
    if (avg > 65) pool = BREATHING_MOMENTS.good;
    else if (avg > 45) pool = BREATHING_MOMENTS.neutral;
    else if (avg > 25) pool = BREATHING_MOMENTS.bad;
    else pool = BREATHING_MOMENTS.crisis;
  } else {
    // Honeymoon: original thresholds
    if (avg > 70) pool = BREATHING_MOMENTS.good;
    else if (avg > 50) pool = BREATHING_MOMENTS.neutral;
    else if (avg > 30) pool = BREATHING_MOMENTS.bad;
    else pool = BREATHING_MOMENTS.crisis;
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

// --- COMPRESSION SUMMARIES ---
// One line per skipped week, keyed to game state. Not random — specific.
export function getCompressionLine(dims: GameDimensions, week: number, arr: number): string {
  const act = getAct(week);
  const avg = (dims.company + dims.relationships + dims.energy + dims.integrity) / 4;

  // Pick from act + state specific pool
  let pool: string[];
  if (act === 1) {
    pool = avg > 55 ? COMPRESSION_LINES.act1_good : COMPRESSION_LINES.act1_rough;
  } else if (act === 2) {
    pool = avg > 50 ? COMPRESSION_LINES.act2_holding : COMPRESSION_LINES.act2_grinding;
  } else {
    pool = avg > 45 ? COMPRESSION_LINES.act3_hope : COMPRESSION_LINES.act3_heavy;
  }

  // Dimension crisis overrides
  if (dims.energy < 25) pool = COMPRESSION_LINES.burnout;
  else if (dims.relationships < 30) pool = COMPRESSION_LINES.isolation;
  else if (dims.integrity < 30) pool = COMPRESSION_LINES.compromise;

  // ARR milestone override
  if (arr > 30 && act >= 2) pool = COMPRESSION_LINES.momentum;

  return pool[Math.floor(Math.random() * pool.length)];
}

// --- GHOST TENSIONS ---
// Your last game haunts this one. These tensions reference your actual history.
// They fire once in Act 2 and once in Act 3 — two moments where the game remembers.

function buildGhostTension(ghost: PlayRecord, week: number, dims: GameDimensions): IndexedTension | null {
  const act = getAct(week);
  if (act === 1) return null; // Let them settle in first

  const lastChoice = ghost.keyChoices?.[ghost.keyChoices.length - 1];
  const lastCompany = ghost.companyName || 'your last company';
  const weakDim = ghost.weakestDim || 'energy';

  const weakDimLabel: Record<string, string> = {
    company: 'the product',
    relationships: 'the people around you',
    energy: 'yourself',
    integrity: 'the truth',
  };

  // The effect: choosing "differently" boosts what killed you last time,
  // choosing "the same" gives a small comfort bonus but repeats the pattern
  const boostKey = weakDim as keyof TensionEffect;
  const repeatEffect: TensionEffect = { company: 2, relationships: 2, energy: 5, integrity: 0 };
  const changeEffect: TensionEffect = { company: -3, relationships: -3, energy: -3, integrity: 3 };
  changeEffect[boostKey] = 12;   // Big boost to what killed you
  repeatEffect[boostKey] = -5;   // Keeps the pattern going

  if (act === 2 && ghost.ending === 'burnout') {
    return {
      idx: -100, // Ghost index — never conflicts with real tensions
      context: `It's late. You've been here before — not this office, but this moment. ${lastCompany} ended the same way. You kept pushing. You know exactly what happens next.`,
      left: "Slow down this time",
      right: lastChoice || "Push through",
      leftEffect: changeEffect,
      rightEffect: repeatEffect,
      category: 'ghost',
      interiority: `Last time, you lost ${weakDimLabel[weakDim] || 'everything'}.`,
      format: 'observation',
    };
  }

  if (act === 2 && ghost.ending === 'disgraced') {
    return {
      idx: -100,
      context: `A shortcut presents itself. Familiar. The kind of shortcut that saved ${lastCompany} for three weeks before it destroyed everything.`,
      left: "Do it differently",
      right: "Take the shortcut",
      leftEffect: changeEffect,
      rightEffect: repeatEffect,
      category: 'ghost',
      interiority: "You've made this exact choice before.",
      format: 'intimate',
    };
  }

  if (act === 2 && (ghost.ending === 'bankrupt' || ghost.ending === 'forced_sale')) {
    return {
      idx: -100,
      context: `The numbers look familiar. Not the specific numbers — the shape of them. The same downward curve you watched at ${lastCompany} before it was too late.`,
      left: "Act now",
      right: "Wait and see",
      leftEffect: changeEffect,
      rightEffect: repeatEffect,
      category: 'ghost',
      interiority: "You recognize this feeling.",
      format: 'observation',
    };
  }

  if (act === 3) {
    // Act 3 ghost: regardless of last ending, the game asks if you've changed
    const wasSuccess = ghost.ending === 'ipo' || ghost.ending === 'acquired';
    return {
      idx: -101,
      context: wasSuccess
        ? `You made it once before. ${lastCompany} was the proof. But you're not the same person who built that. The question isn't whether you can do it again. It's whether you should do it the same way.`
        : `${lastCompany} taught you something. Maybe it was what not to sacrifice. Maybe it was who not to trust. Whatever it was — this is the moment where you find out if you learned it.`,
      left: wasSuccess ? "Trust the old playbook" : "Try something new",
      right: wasSuccess ? "Reinvent" : "Trust your instincts",
      leftEffect: wasSuccess ? repeatEffect : changeEffect,
      rightEffect: wasSuccess ? changeEffect : repeatEffect,
      category: 'ghost',
      interiority: wasSuccess
        ? `Last time ended at $${ghost.valuation}M. That number means something.`
        : `Last time ended in ${ghost.endingLabel.toLowerCase()}. That memory means something.`,
      format: 'intimate',
      fourthWall: true,
    };
  }

  return null;
}

export function getTension(week: number, usedIndices: Set<number>, dims?: GameDimensions, cash?: number, pastChoices?: string[], archetypeBias?: Record<string, number>, ghost?: PlayRecord | null): IndexedTension {
  // Ghost tension — your last game talks to you (once in Act 2 around week 11-13, once in Act 3 around week 19-21)
  const ghostWeeks = [11, 12, 13, 19, 20, 21];
  if (ghost && dims && ghostWeeks.includes(week) && !usedIndices.has(-100) && !usedIndices.has(-101)) {
    const ghostT = buildGhostTension(ghost, week, dims);
    if (ghostT) return ghostT;
  }

  const choiceSet = new Set(pastChoices || []);

  // Filter: remove tensions whose `requires` hasn't been met, and keep ones that have
  const available = TENSIONS.map((t, i) => ({ ...t, idx: i })).filter(t => {
    if (usedIndices.has(t.idx)) return false;
    // If tension requires a past choice, only include if that choice was made
    if (t.requires && !choiceSet.has(t.requires.choice)) return false;
    // Fourth wall moments only appear in weeks 14-17 (one per game, late Act 2)
    if (t.fourthWall && (week < 14 || week > 17)) return false;
    return true;
  });

  if (available.length === 0) return { ...TENSIONS[Math.floor(Math.random() * TENSIONS.length)], idx: -1 };

  // If no dims provided, fall back to random (first tension)
  if (!dims) return available[Math.floor(Math.random() * available.length)];

  // The game knows who you've been. It attacks your weakest point.
  // Consequence tensions (requires) get priority — the game remembers your choices.
  const scored = available.map(t => {
    // Consequence tensions get a massive bonus — they should appear soon after the triggering choice
    let score = t.requires ? 15 : 0;

    // Find the player's weakest dimension
    const dimEntries: [string, number][] = [
      ['company', dims.company], ['relationships', dims.relationships],
      ['energy', dims.energy], ['integrity', dims.integrity],
    ];
    dimEntries.sort((a, b) => a[1] - b[1]);
    const weakest = dimEntries[0][0] as keyof GameDimensions;
    const secondWeakest = dimEntries[1][0] as keyof GameDimensions;

    // Prefer tensions where BOTH choices hurt the weakest dimension
    // (no safe path — you have to sacrifice what you can't afford)
    if (t.leftEffect[weakest] < -5 || t.rightEffect[weakest] < -5) score += 3;
    if (t.leftEffect[weakest] < -5 && t.rightEffect[weakest] < -5) score += 5;

    // Prefer tensions that force tradeoffs between the two weakest dims
    if ((t.leftEffect[weakest] < 0 && t.leftEffect[secondWeakest] > 0) ||
        (t.rightEffect[weakest] < 0 && t.rightEffect[secondWeakest] > 0)) score += 2;

    // Category targeting: match tension category to the crisis
    if (dims.company < 35 && t.category === 'product') score += 3;
    if (dims.company < 35 && t.category === 'strategy') score += 2;
    if (dims.relationships < 35 && t.category === 'people') score += 3;
    if (dims.energy < 40 && t.category === 'life') score += 3;
    if (dims.integrity < 35 && t.category === 'values') score += 3;

    // Cash crisis — prefer strategy tensions
    if (cash !== undefined && cash < 500 && t.category === 'strategy') score += 3;

    // Archetype bias — the game learns your pattern and pushes back
    if (archetypeBias && archetypeBias[t.category]) {
      score += archetypeBias[t.category];
    }

    // Act-based tension bias — each act has a different emotional center
    const act = getAct(week);
    if (act === 1) {
      // Honeymoon: product and strategy tensions dominate — building phase
      if (t.category === 'product') score += 2;
      if (t.category === 'strategy') score += 1;
    } else if (act === 2) {
      // Grind: people and values tensions rise — cracks show
      if (t.category === 'people') score += 2;
      if (t.category === 'values') score += 2;
      if (t.category === 'life') score += 1;
    } else {
      // Reckoning: intimate and values — legacy, cost, what it meant
      if (t.category === 'values') score += 3;
      if (t.category === 'life') score += 2;
      if (t.format === 'intimate') score += 2;
    }

    // Fourth wall moments get a strong bonus when they're eligible — they should feel inevitable
    if (t.fourthWall && week >= 14 && week <= 17) score += 10;

    // Variety: meaningful random factor so replays feel different
    score += Math.random() * 5;

    return { tension: t, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Pick from top 5 to maintain real unpredictability across replays
  const topN = scored.slice(0, Math.min(5, scored.length));
  const picked = topN[Math.floor(Math.random() * topN.length)].tension;

  // --- ANTI-MEMORIZATION ---
  // 1. Randomly swap left/right so "the good answer" isn't always the same button
  if (Math.random() > 0.5 && !picked.requires && picked.format !== 'forced') {
    const swapped: IndexedTension = {
      ...picked,
      left: picked.right,
      right: picked.left,
      leftEffect: { ...picked.rightEffect },
      rightEffect: { ...picked.leftEffect },
      leftForeshadow: picked.rightForeshadow,
      rightForeshadow: picked.leftForeshadow,
    };
    return applyStatePressure(swapped, dims);
  }

  return applyStatePressure(picked, dims);
}

// 2. State-dependent effect scaling — the same choice costs more when you're weak.
// Choosing "ship it now" at 30 energy costs -15 energy instead of -8.
// This means memorizing "which button to press" is useless — the math changes.
function applyStatePressure(t: IndexedTension, dims: GameDimensions): IndexedTension {
  const scale = (effect: number, dimValue: number): number => {
    if (effect >= 0) return effect; // Only amplify costs, not gains
    // When a dimension is below 35, negative effects are 30-60% worse
    const vulnerability = dimValue < 35 ? 1.6 : dimValue < 50 ? 1.3 : 1.0;
    return Math.round(effect * vulnerability);
  };

  const dimKeys: (keyof GameDimensions)[] = ['company', 'relationships', 'energy', 'integrity'];

  const newLeft = { ...t.leftEffect };
  const newRight = { ...t.rightEffect };
  for (const k of dimKeys) {
    newLeft[k] = scale(newLeft[k], dims[k]);
    newRight[k] = scale(newRight[k], dims[k]);
  }

  return { ...t, leftEffect: newLeft, rightEffect: newRight };
}

export function checkEnding(state: { week: number; cash: number; arr: number; dims: GameDimensions }): Ending | null {
  const { week, cash, arr, dims } = state;

  // Grace period: no catastrophic endings before week 4. Let the player feel the game first.
  // Cash can still run out (that's math, not drama) but dimension-based deaths need room to breathe.
  if (week >= 4) {
    if (dims.energy <= 0) return { type: "burnout", label: "BURNED OUT", emoji: "🔥", line: `Burned out in week ${week}. Company was worth $${Math.round(arr / 10)}M without you.` };
    if (dims.integrity <= 0) return { type: "disgraced", label: "DISGRACED", emoji: "🪦", line: `Disgraced in week ${week}. The Glassdoor reviews wrote themselves.` };
  }
  if (cash <= 0) return { type: "bankrupt", label: "BANKRUPT", emoji: "💀", line: `Bankrupt in week ${week}.` };
  if (week >= 6 && dims.relationships <= 10 && dims.company > 40) return { type: "board_removed", label: "BOARD REMOVED", emoji: "🚪", line: `Board removed you in week ${week}. Company was worth $${Math.round(arr / 8)}M.` };
  if (arr >= 25 && dims.integrity > 50 && dims.relationships > 40 && dims.energy > 30) return { type: "ipo", label: "IPO", emoji: "🔔", line: `IPO'd at $${Math.round(arr * 3.5)}M in ${week} weeks.${dims.relationships > 65 ? " The whole team was still there." : ""}` };
  if (arr >= 15 && week >= 10) {
    if (Math.random() < 0.15) return { type: "acquired", label: "ACQUIRED", emoji: "🤝", line: `Acquired for $${Math.round(arr * 2.2)}M in ${week} weeks.` };
  }
  if (cash < 200 && arr > 5) return { type: "forced_sale", label: "FORCED SALE", emoji: "📉", line: `Forced sale at $${Math.round(arr * 0.8)}M in week ${week}. Took what you could get.` };
  if (week >= TOTAL_WEEKS) {
    const val = Math.round(arr * 1.5);
    return { type: "time_up", label: "TIME'S UP", emoji: "⏰", line: `${TOTAL_WEEKS} weeks. Company valued at $${val}M. The story just... stopped.` };
  }
  return null;
}

// The last line — a closing shot that plays before the endgame card.
// One sentence. The screen goes dark. This is what they remember.
export function getEndingLastLine(ending: Ending, dims: GameDimensions): string {
  switch (ending.type) {
    case 'burnout':
      return dims.relationships > 40
        ? "Priya found you asleep at your desk. She didn't wake you."
        : "The office was empty when your laptop finally died.";
    case 'disgraced':
      return dims.company > 30
        ? "The product still worked. Nobody wanted to touch it."
        : "The last article about you was four paragraphs. You only read the headline.";
    case 'bankrupt':
      return dims.energy > 30
        ? "You had the energy to keep going. You didn't have the money."
        : "The last email you sent was to your landlord.";
    case 'board_removed':
      return dims.integrity > 50
        ? "You built something good. They just didn't want you in the room anymore."
        : "David didn't call. His assistant did.";
    case 'ipo':
      return dims.energy > 50
        ? "The bell rang. Everyone was crying. You couldn't feel anything yet."
        : "The bell rang. You smiled for the camera. Nobody saw your hands shaking.";
    case 'acquired':
      return dims.relationships > 50
        ? "The check cleared on a Tuesday. Priya brought champagne. Nobody opened it."
        : "The check cleared. You sat in your car for twenty minutes before driving home.";
    case 'forced_sale':
      return "You signed the papers in a conference room that smelled like old coffee.";
    case 'time_up':
      return dims.energy > 40
        ? "The year ended. You didn't notice until someone mentioned it."
        : "The year ended. You thought you had more time. Everyone does.";
    default:
      return "The room went quiet. And then it was over.";
  }
}

export function getValuation(ending: Ending, arr: number): number {
  switch (ending.type) {
    case "ipo": return Math.round(arr * 3.5);
    case "acquired": return Math.round(arr * 2.2);
    case "board_removed": return Math.round(arr / 8);
    case "forced_sale": return Math.round(arr * 0.8);
    case "burnout": return Math.round(arr / 10);
    case "bankrupt": return 0;
    case "disgraced": return 0;
    case "time_up": return Math.round(arr * 1.5);
    default: return 0;
  }
}
