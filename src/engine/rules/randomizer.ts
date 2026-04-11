import { TETROMINO_IDS, type TetrominoId } from '../../types/game';

export type RandomSource = () => number;

export interface BagState {
  queue: TetrominoId[];
  bagsGenerated: number;
}

export class SevenBagRandomizer {
  private readonly randomSource: RandomSource;

  private readonly queue: TetrominoId[] = [];

  private bagsGenerated = 0;

  constructor(randomSource: RandomSource = Math.random, initialQueue: TetrominoId[] = []) {
    this.randomSource = randomSource;
    this.queue.push(...initialQueue);
  }

  next(): TetrominoId {
    this.ensureQueue(1);

    const nextPiece = this.queue.shift();

    if (!nextPiece) {
      throw new Error('Seven-bag queue unexpectedly empty.');
    }

    return nextPiece;
  }

  preview(count: number): readonly TetrominoId[] {
    this.ensureQueue(count);
    return this.queue.slice(0, count);
  }

  exportState(): BagState {
    return {
      queue: [...this.queue],
      bagsGenerated: this.bagsGenerated,
    };
  }

  private ensureQueue(count: number) {
    while (this.queue.length < count) {
      this.queue.push(...this.generateBag());
    }
  }

  private generateBag(): TetrominoId[] {
    const bag = [...TETROMINO_IDS];

    for (let index = bag.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(this.randomSource() * (index + 1));
      [bag[index], bag[swapIndex]] = [bag[swapIndex], bag[index]];
    }

    this.bagsGenerated += 1;
    return bag;
  }
}

export function createSeededRandomSource(seed: string): RandomSource {
  let hash = 2166136261;

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return () => {
    hash += 0x6d2b79f5;
    let result = Math.imul(hash ^ (hash >>> 15), 1 | hash);
    result ^= result + Math.imul(result ^ (result >>> 7), 61 | result);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}