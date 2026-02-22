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
}

export interface EndData {
  ending: Ending;
  arr: number;
  dims: GameDimensions;
  decisions: Decision[];
  weekLog: string[];
}
