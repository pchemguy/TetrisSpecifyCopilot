export function PauseOverlay() {
  return (
    <div className="playfield-overlay" role="dialog" aria-label="Pause overlay">
      <p className="section-label">Session halted</p>
      <h3>Paused</h3>
      <p>Press P or Escape to resume.</p>
    </div>
  );
}

export default PauseOverlay;