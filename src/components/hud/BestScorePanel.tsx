export interface BestScorePanelProps {
  bestScore: number;
  isVisible: boolean;
}

export function BestScorePanel({ bestScore, isVisible }: BestScorePanelProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <section className="hud-panel" aria-label="Best score panel">
      <p className="section-label">Best score</p>
      <strong>{bestScore}</strong>
      <p>{bestScore > 0 ? 'Saved locally for this desktop app.' : 'No personal best yet.'}</p>
    </section>
  );
}

export default BestScorePanel;