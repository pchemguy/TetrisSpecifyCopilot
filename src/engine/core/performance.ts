export interface PerformanceSnapshot {
  lastInputLatencyMs: number | null;
}

const INPUT_LATENCY_BUDGET_MS = 100;

export class PerformanceTracker {
  private lastInputStartedAt: number | null = null;

  markInput(): void {
    this.lastInputStartedAt = performance.now();
  }

  consumeLatency(): number | null {
    if (this.lastInputStartedAt === null) {
      return null;
    }

    const latencyMs = performance.now() - this.lastInputStartedAt;
    this.lastInputStartedAt = null;
    return latencyMs;
  }
}

export function createPerformanceSnapshot(lastInputLatencyMs: number | null): PerformanceSnapshot {
  return {
    lastInputLatencyMs,
  };
}

export function isInputLatencyWithinBudget(snapshot: PerformanceSnapshot): boolean {
  return snapshot.lastInputLatencyMs === null || snapshot.lastInputLatencyMs <= INPUT_LATENCY_BUDGET_MS;
}

export function summarizeSessionPerformance(lastInputLatencyMs: number | null) {
  return {
    withinInputBudget: isInputLatencyWithinBudget(createPerformanceSnapshot(lastInputLatencyMs)),
    lastInputLatencyMs,
    requiresAttention: lastInputLatencyMs !== null && lastInputLatencyMs > INPUT_LATENCY_BUDGET_MS,
  };
}