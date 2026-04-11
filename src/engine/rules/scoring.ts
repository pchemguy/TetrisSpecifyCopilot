import type { GameMetrics } from '../../types/game';
import { calculateLevel } from './leveling';

const LINE_CLEAR_SCORES: Record<number, number> = {
  0: 0,
  1: 100,
  2: 300,
  3: 500,
  4: 800,
};

export interface ScoringInput {
  level: number;
  linesCleared: number;
  totalLinesCleared: number;
  linesPerLevel: number;
  softDropRows?: number;
  hardDropRows?: number;
}

export function calculateLineClearScore(linesCleared: number, level: number): number {
  return (LINE_CLEAR_SCORES[linesCleared] ?? 0) * level;
}

export function applyScoring(metrics: GameMetrics, input: ScoringInput): GameMetrics {
  const lineClearScore = calculateLineClearScore(input.linesCleared, input.level);
  const softDropScore = (input.softDropRows ?? 0) * 1;
  const hardDropScore = (input.hardDropRows ?? 0) * 2;

  return {
    ...metrics,
    score: metrics.score + lineClearScore + softDropScore + hardDropScore,
    linesCleared: input.totalLinesCleared,
    level: calculateLevel(input.totalLinesCleared, input.linesPerLevel),
  };
}