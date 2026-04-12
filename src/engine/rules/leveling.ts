export function calculateLevel(linesCleared: number, linesPerLevel: number): number {
  return Math.floor(linesCleared / linesPerLevel) + 1;
}