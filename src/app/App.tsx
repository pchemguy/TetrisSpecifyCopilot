const readinessItems = [
  'Client-only runtime',
  'Deterministic engine scaffold',
  'Local persistence pipeline',
];

export default function App() {
  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">Classic Browser Tetris</p>
        <h1>Build the playfield before the first piece drops.</h1>
        <p className="hero-copy">
          The project shell is ready for the game loop, canvas renderer, and local-first
          persistence layers that follow in the next setup tasks.
        </p>
        <div className="readiness-strip" aria-label="Scaffold readiness highlights">
          {readinessItems.map((item) => (
            <span key={item} className="readiness-pill">
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="workspace-grid" aria-label="Application shell preview">
        <article className="surface-card playfield-card">
          <header>
            <p className="section-label">Playfield Surface</p>
            <h2>Canvas mount target</h2>
          </header>
          <div className="playfield-placeholder" aria-hidden="true">
            <div className="playfield-matrix" />
          </div>
          <p className="card-copy">
            This region is reserved for the HTML5 canvas renderer and overlays that will drive
            the actual game board.
          </p>
        </article>

        <aside className="surface-card status-card">
          <header>
            <p className="section-label">Setup Status</p>
            <h2>Phase 1 foundation</h2>
          </header>
          <dl className="status-list">
            <div>
              <dt>Current task</dt>
              <dd>Base shell and entrypoint</dd>
            </div>
            <div>
              <dt>Next handoff</dt>
              <dd>Linting, test harness, and shared providers</dd>
            </div>
            <div>
              <dt>Runtime shape</dt>
              <dd>React shell + canvas gameplay + browser-local storage</dd>
            </div>
          </dl>
        </aside>
      </section>
    </main>
  );
}