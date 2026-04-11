export interface ScorePanelProps {
  score: number;
  bestScore: number;
  level: number;
  linesCleared: number;
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="hud-stat-card">
      <span className="sr-only">{label} {value}</span>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export function ScorePanel({ score, bestScore, level, linesCleared }: ScorePanelProps) {
  return (
    <section className="hud-panel" aria-label="Score panel">
      <p className="section-label">Run metrics</p>
      <dl className="hud-stat-grid">
        <StatCard label="Score" value={score} />
        <StatCard label="Best" value={bestScore} />
        <StatCard label="Level" value={level} />
        <StatCard label="Lines" value={linesCleared} />
      </dl>
    </section>
  );
}

export default ScorePanel;