export interface GameDimensions {
  company: number;
  relationships: number;
  energy: number;
  integrity: number;
}

export interface TensionEffect {
  company: number;
  relationships: number;
  energy: number;
  integrity: number;
}

// How the tension is presented — each format changes the visual treatment
export type TensionFormat =
  | 'standard'     // default: context paragraph + two choices
  | 'slack'        // looks like a Slack message — sender, channel, timestamp
  | 'email'        // email format — from, subject, body
  | 'observation'  // second-person interior — "You notice..."
  | 'intimate'     // one sentence. no choices visible at first.
  | 'phone'        // phone notification — app icon, preview text
  | 'forced';      // only one option. the world decided for you.

export interface Tension {
  left: string;
  right: string;
  context: string;
  leftEffect: TensionEffect;
  rightEffect: TensionEffect;
  category: string;
  // Path dependency: tension only appears if a specific past choice was made
  requires?: { choice: string };
  // Foreshadowing: a line that appears after choosing left or right, hinting at consequences
  leftForeshadow?: string;
  rightForeshadow?: string;
  // Visual format — how this tension appears on screen
  format?: TensionFormat;
  // For slack/email/phone formats: who sent it
  sender?: string;
  // For email: subject line
  subject?: string;
  // For forced format: the only option available
  forcedChoice?: 'left' | 'right';
  // Interior monologue line — appears before the context
  interiority?: string;
  // Personal context — one-line sentence grounding the abstract dilemma in human terms
  personalContext?: string;
  // Callback line — reminder of the past choice that triggered this consequence
  callbackLine?: string;
}

export interface IndexedTension extends Tension {
  idx: number;
}

export interface Ending {
  type: 'bankrupt' | 'burnout' | 'disgraced' | 'board_removed' | 'ipo' | 'acquired' | 'forced_sale' | 'time_up';
  label: string;
  emoji: string;
  line: string;
}

export interface Decision {
  week: number;
  context: string;
  choice: string;
  dims: GameDimensions;
}

export interface GameState {
  screen: 'onboarding' | 'cinema' | 'game' | 'endgame';
  companyName: string;
  firstChoice: string;
  week: number;
  cash: number;
  arr: number;
  dims: GameDimensions;
  decisions: Decision[];
  weekLog: string[];
  usedTensionIndices: number[];
  pivotalMoments: string[];
}

export interface EndData {
  ending: Ending;
  arr: number;
  dims: GameDimensions;
  decisions: Decision[];
  weekLog: string[];
  pivotalMoments: string[];
}
