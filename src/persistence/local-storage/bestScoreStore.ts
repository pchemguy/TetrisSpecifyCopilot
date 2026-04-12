import { LOCAL_STORAGE_KEYS } from '../../types/persistence';

function hasLocalStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readBestScore(): number {
  if (!hasLocalStorage()) {
    return 0;
  }

  const storedValue = window.localStorage.getItem(LOCAL_STORAGE_KEYS.bestScore);

  if (!storedValue) {
    return 0;
  }

  const parsed = Number(storedValue);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export function writeBestScore(score: number): number {
  if (!hasLocalStorage()) {
    return Math.max(0, score);
  }

  const normalizedScore = Math.max(0, Math.floor(score));
  window.localStorage.setItem(LOCAL_STORAGE_KEYS.bestScore, String(normalizedScore));
  return normalizedScore;
}

export function commitBestScore(score: number): number {
  const nextBestScore = Math.max(readBestScore(), Math.max(0, Math.floor(score)));
  writeBestScore(nextBestScore);
  return nextBestScore;
}

export function resetBestScore(): number {
  return writeBestScore(0);
}