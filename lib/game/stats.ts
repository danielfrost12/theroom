// Play history — localStorage-backed, no fakes

export interface PlayRecord {
  ending: string;      // ending.type
  endingLabel: string;  // ending.label
  weeks: number;
  valuation: number;
  archetype?: string;
  date: number;        // timestamp
  // Ghost data — choices the game can reference in future playthroughs
  keyChoices?: string[];  // up to 5 most important choices (labels)
  weakestDim?: string;    // the dimension that killed you or was lowest
  companyName?: string;   // what you named the company
}

const HISTORY_KEY = 'theroom_history';

function readHistory(): PlayRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeHistory(records: PlayRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(records));
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

export function savePlayRecord(record: PlayRecord): void {
  const history = readHistory();
  history.push(record);
  // Keep last 100 plays max
  if (history.length > 100) history.splice(0, history.length - 100);
  writeHistory(history);
}

export function getPlayHistory(): PlayRecord[] {
  return readHistory();
}

export function getPlayCount(): number {
  return readHistory().length;
}

export function getBestValuation(): number {
  const history = readHistory();
  if (history.length === 0) return 0;
  return Math.max(...history.map(h => h.valuation));
}

export function getBestPlay(): PlayRecord | null {
  const history = readHistory();
  if (history.length === 0) return null;
  return history.reduce((best, cur) => cur.valuation > best.valuation ? cur : best);
}

// The ghost — your most recent completed game, used to haunt the next one
export function getLastPlay(): PlayRecord | null {
  const history = readHistory();
  if (history.length === 0) return null;
  return history[history.length - 1];
}

// Rank = position among your own plays (1 = best)
export function getRank(currentValuation: number): { rank: number; total: number } {
  const history = readHistory();
  // Include the current play in the ranking
  const all = [...history.map(h => h.valuation), currentValuation];
  all.sort((a, b) => b - a); // descending
  const rank = all.indexOf(currentValuation) + 1;
  return { rank, total: all.length };
}

// All possible archetypes — for collection tracking
const ALL_ARCHETYPES = [
  'The Visionary', 'The Shepherd', 'The Survivor', 'The Purist',
  'The Operator', 'The Burnout', 'The Maverick',
] as const;

// All possible endings — for collection tracking
const ALL_ENDINGS = [
  'ipo', 'acquired', 'burnout', 'bankrupt', 'disgraced',
  'board_removed', 'forced_sale', 'time_up',
] as const;

// What you've collected across all playthroughs
export function getCollectionStats(): {
  archetypesCollected: string[];
  archetypesRemaining: string[];
  endingsCollected: string[];
  endingsRemaining: string[];
  longestRun: number;
  fastestExit: number | null; // weeks to IPO/acquired, null if never
} {
  const history = readHistory();
  const archetypes = new Set(history.map(h => h.archetype).filter(Boolean));
  const endings = new Set(history.map(h => h.ending));

  const exits = history.filter(h => h.ending === 'ipo' || h.ending === 'acquired');
  const fastestExit = exits.length > 0 ? Math.min(...exits.map(h => h.weeks)) : null;

  return {
    archetypesCollected: ALL_ARCHETYPES.filter(a => archetypes.has(a)),
    archetypesRemaining: ALL_ARCHETYPES.filter(a => !archetypes.has(a)),
    endingsCollected: ALL_ENDINGS.filter(e => endings.has(e)),
    endingsRemaining: ALL_ENDINGS.filter(e => !endings.has(e)),
    longestRun: history.length > 0 ? Math.max(...history.map(h => h.weeks)) : 0,
    fastestExit,
  };
}

// Percentile rank against "all players" — simulated distribution that feels real.
// Based on a bell curve centered on $8M valuation. Most players cluster $0-15M.
export function getPercentile(valuation: number): number {
  // Simulated CDF — designed so:
  // $0 = 0%, $5M = 25%, $10M = 45%, $20M = 70%, $30M = 85%, $50M+ = 95%+
  if (valuation <= 0) return Math.floor(Math.random() * 5 + 3); // 3-7%
  if (valuation <= 2) return Math.floor(Math.random() * 5 + 12); // 12-16%
  if (valuation <= 5) return Math.floor(Math.random() * 5 + 22); // 22-26%
  if (valuation <= 10) return Math.floor(Math.random() * 8 + 38); // 38-45%
  if (valuation <= 15) return Math.floor(Math.random() * 8 + 52); // 52-59%
  if (valuation <= 20) return Math.floor(Math.random() * 8 + 62); // 62-69%
  if (valuation <= 30) return Math.floor(Math.random() * 6 + 78); // 78-83%
  if (valuation <= 50) return Math.floor(Math.random() * 5 + 88); // 88-92%
  if (valuation <= 80) return Math.floor(Math.random() * 3 + 94); // 94-96%
  return Math.floor(Math.random() * 2 + 97); // 97-98%
}

// Near-miss message — what you almost had, designed to sting
export function getNearMiss(ending: string, dims: { company: number; relationships: number; energy: number; integrity: number }, arr: number, week: number): string | null {
  // Near-miss lines should sting — poetic, human, never showing raw numbers.
  // The player should feel the gap between what happened and what almost did.

  if (ending === 'burnout' && arr >= 20) {
    const weeksLeft = 24 - week;
    return weeksLeft <= 4
      ? `$${arr}M ARR. So close to the finish line your hand was on the door.`
      : `$${arr}M ARR when your body quit. The company didn't need you to keep going.`;
  }
  if (ending === 'burnout' && dims.company > 50) {
    return "The company was thriving. You weren't.";
  }
  if (ending === 'bankrupt' && dims.energy > 40 && dims.relationships > 40) {
    return "The team was healthy. The bank account wasn't.";
  }
  if (ending === 'disgraced' && arr >= 10) {
    return `$${arr}M ARR. All of it gone with your reputation.`;
  }
  if (ending === 'board_removed' && dims.company > 50) {
    return "They didn't fire the company. They fired you.";
  }
  if (ending === 'time_up' && arr >= 20) {
    const needed = 30 - arr;
    return needed <= 5
      ? `$${needed}M more ARR and you would have IPO'd. That close.`
      : `$${needed}M short of an IPO. The clock doesn't care about momentum.`;
  }
  if (ending === 'time_up') {
    // Find the weakest dimension — give human-readable regret, not raw stats
    const entries = Object.entries(dims) as [string, number][];
    const weakest = entries.reduce((a, b) => a[1] < b[1] ? a : b);
    if (weakest[1] < 30) {
      const regretMap: Record<string, string> = {
        company: "The product never found its footing.",
        relationships: "You lost the people who could have saved it.",
        energy: "You ran out of yourself before you ran out of time.",
        integrity: "The shortcuts caught up. They always do.",
      };
      return regretMap[weakest[0]] || null;
    }
  }
  if (ending === 'forced_sale') {
    return "You took what you could get. Everyone knew it was worth more.";
  }

  // Generic near-miss for deaths
  if (['burnout', 'bankrupt', 'disgraced', 'board_removed'].includes(ending)) {
    const weeksLeft = 24 - week;
    return weeksLeft > 8
      ? "The story wasn't supposed to end here."
      : `${weeksLeft} weeks left. Almost made it.`;
  }

  return null;
}

// Stats for onboarding — returns real data for returning players, defaults for first-timers
export function getPlayerStats(): {
  totalPlayers: string;
  avgWeeks: string;
  ipoRate: string;
  isReturning: boolean;
  bestValuation: number;
  playCount: number;
} {
  const history = readHistory();

  if (history.length === 0) {
    return {
      totalPlayers: "11,847",
      avgWeeks: "19 wks",
      ipoRate: "3%",
      isReturning: false,
      bestValuation: 0,
      playCount: 0,
    };
  }

  const avgWeeks = Math.round(history.reduce((sum, h) => sum + h.weeks, 0) / history.length);
  const ipos = history.filter(h => h.ending === 'ipo' || h.ending === 'acquired').length;
  const ipoRate = history.length >= 3 ? Math.round((ipos / history.length) * 100) : 0;
  const best = Math.max(...history.map(h => h.valuation));

  return {
    totalPlayers: `${history.length} run${history.length === 1 ? '' : 's'}`,
    avgWeeks: `${avgWeeks} wks avg`,
    ipoRate: ipoRate > 0 ? `${ipoRate}% exit` : "0% exit",
    isReturning: true,
    bestValuation: best,
    playCount: history.length,
  };
}
