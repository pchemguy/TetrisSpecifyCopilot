import { beforeEach, describe, expect, it } from 'vitest';
import { commitBestScore, readBestScore, resetBestScore, writeBestScore } from '../../../src/persistence/local-storage/bestScoreStore';

describe('best score store', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('reads zero when no best score has been persisted yet', () => {
    expect(readBestScore()).toBe(0);
  });

  it('commits only a higher score and preserves the previous best otherwise', () => {
    writeBestScore(1200);

    expect(commitBestScore(800)).toBe(1200);
    expect(commitBestScore(2400)).toBe(2400);
    expect(readBestScore()).toBe(2400);
  });

  it('resets the stored best score back to zero', () => {
    writeBestScore(900);
    expect(resetBestScore()).toBe(0);
    expect(readBestScore()).toBe(0);
  });
});