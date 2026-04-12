const CONTROL_ITEMS = [
  'Left/Right: move',
  'Up or X: rotate clockwise',
  'Z: rotate counterclockwise',
  'Down: soft drop',
  'Space: hard drop',
  'C or Shift: hold',
  'P or Escape: pause',
  'R: restart',
];

export function ControlLegend() {
  return (
    <section className="hud-panel control-legend" aria-label="Controls legend">
      <p className="section-label">Controls</p>
      <ul>
        {CONTROL_ITEMS.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export default ControlLegend;