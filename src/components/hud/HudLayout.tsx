import type { PropsWithChildren, ReactNode } from 'react';

export interface HudLayoutProps extends PropsWithChildren {
  score: number;
  bestScore: number;
  level: number;
  linesCleared: number;
  status: string;
  aside?: ReactNode;
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="hud-stat-card">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export function HudLayout({
  score,
  bestScore,
  level,
  linesCleared,
  status,
  children,
  aside,
}: HudLayoutProps) {
  return (
    <section className="hud-layout">
      <div className="hud-primary">{children}</div>
      <aside className="hud-aside">
        <dl className="hud-stat-grid">
          <StatCard label="Score" value={score} />
          <StatCard label="Best" value={bestScore} />
          <StatCard label="Level" value={level} />
          <StatCard label="Lines" value={linesCleared} />
        </dl>

        <div className="hud-status-card">
          <p className="section-label">Session status</p>
          <strong>{status}</strong>
          <p>Canvas rendering and persistence hydration are now wired into the shared shell.</p>
        </div>

        {aside}
      </aside>
    </section>
  );
}

export default HudLayout;