import { GameDimensions, Ending, IndexedTension } from './types';
import { TENSIONS, BREATHING_MOMENTS } from './constants';

export function getSceneForState(dims: GameDimensions, week: number): string {
  if (dims.energy < 25) return "apartment_night";
  if (dims.integrity < 25) return "bar";
  if (dims.relationships < 30) return "park_bench";
  if (week > 40) return "rooftop";
  if (dims.company > 75 && dims.energy > 60) return "coworking";
  const cycle = week % 5;
  if (cycle === 0) return "office_morning";
  if (cycle === 1) return "coffee_shop";
  if (cycle === 2) return "boardroom";
  if (cycle === 3) return "office_night";
  return "elevator";
}

export function getBreathingMoment(dims: GameDimensions): string {
  const avg = (dims.company + dims.relationships + dims.energy + dims.integrity) / 4;
  let pool: string[];
  if (avg > 70) pool = BREATHING_MOMENTS.good;
  else if (avg > 50) pool = BREATHING_MOMENTS.neutral;
  else if (avg > 30) pool = BREATHING_MOMENTS.bad;
  else pool = BREATHING_MOMENTS.crisis;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getTension(week: number, usedIndices: Set<number>): IndexedTension {
  const available = TENSIONS.map((t, i) => ({ ...t, idx: i })).filter(t => !usedIndices.has(t.idx));
  if (available.length === 0) return { ...TENSIONS[Math.floor(Math.random() * TENSIONS.length)], idx: -1 };
  return available[Math.floor(Math.random() * available.length)];
}

export function checkEnding(state: { week: number; cash: number; arr: number; dims: GameDimensions }): Ending | null {
  const { week, cash, arr, dims } = state;
  if (cash <= 0) return { type: "bankrupt", label: "BANKRUPT", emoji: "\u{1F480}", line: `Bankrupt in week ${week}.` };
  if (dims.energy <= 0) return { type: "burnout", label: "BURNED OUT", emoji: "\u{1F525}", line: `Burned out in week ${week}. Company was worth $${Math.round(arr / 10)}M without you.` };
  if (dims.integrity <= 0) return { type: "disgraced", label: "DISGRACED", emoji: "\u{1FAA6}", line: `Disgraced in week ${week}. The Glassdoor reviews wrote themselves.` };
  if (dims.relationships <= 10 && dims.company > 50) return { type: "board_removed", label: "BOARD REMOVED", emoji: "\u{1F6AA}", line: `Board removed you in week ${week}. Company was worth $${Math.round(arr / 8)}M.` };
  if (arr >= 100 && dims.integrity > 60 && dims.relationships > 50 && dims.energy > 40) return { type: "ipo", label: "IPO", emoji: "\u{1F514}", line: `IPO'd at $${Math.round(arr * 3.5)}M in ${week} weeks.${dims.relationships > 75 ? " The whole team was still there." : ""}` };
  if (arr >= 60 && week >= 20) {
    if (Math.random() < 0.15) return { type: "acquired", label: "ACQUIRED", emoji: "\u{1F91D}", line: `Acquired for $${Math.round(arr * 2.2)}M in ${week} weeks.` };
  }
  if (cash < 200 && arr > 20) return { type: "forced_sale", label: "FORCED SALE", emoji: "\u{1F4C9}", line: `Forced sale at $${Math.round(arr * 0.8)}M in week ${week}. Took what you could get.` };
  if (week >= 52) {
    const val = Math.round(arr * 1.5);
    return { type: "time_up", label: "TIME'S UP", emoji: "\u{23F0}", line: `52 weeks. Company valued at $${val}M. The story just... stopped.` };
  }
  return null;
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
