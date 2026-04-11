export interface GameOverOverlayProps {
  score: number;
  onRestart: () => void;
}

export function GameOverOverlay({ score, onRestart }: GameOverOverlayProps) {
  return (
    <div className="playfield-overlay" role="dialog" aria-label="Game over overlay">
      <p className="section-label">Session complete</p>
      <h3>Game Over</h3>
      <p>Final score: {score}</p>
      <button className="overlay-action" type="button" onClick={onRestart}>
        Restart
      </button>
    </div>
  );
}

export default GameOverOverlay;