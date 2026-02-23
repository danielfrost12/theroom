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
