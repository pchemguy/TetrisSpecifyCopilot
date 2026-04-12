export interface BestScorePanelProps {
  bestScore: number;
}

export function BestScorePanel({ bestScore }: BestScorePanelProps) {
  return (
    <section className="hud-panel" aria-label="Best score panel">
      <p className="section-label">Best score</p>
      <strong>{bestScore}</strong>
      <p>{bestScore > 0 ? 'Saved locally for this browser profile.' : 'No personal best yet.'}</p>
    </section>
  );
}

export default BestScorePanel;