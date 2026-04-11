import type { ScoreRecord, SessionRecord, UIStateDocument, UserSettingsDocument } from '../../types/persistence';
import type { ReplayEnvelope } from '../../types/replay';

export const DEMO_USER_SETTINGS: UserSettingsDocument = {
  version: 1,
  control_profile: 'classic-desktop',
  show_ghost_piece: true,
  auto_pause_on_blur: true,
  reduce_motion: false,
};

export const DEMO_UI_STATE: UIStateDocument = {
  version: 1,
  last_overlay: 'none',
  has_seeded_demo_data: true,
  last_selected_panel: 'stats',
};

export const DEMO_SESSION: SessionRecord = {
  session_id: 'demo-session-001',
  started_at: '2026-04-10T18:00:00.000Z',
  ended_at: '2026-04-10T18:12:34.000Z',
  status: 'game_over',
  seed: 'demo-seed-001',
  score: 12800,
  level: 6,
  lines_cleared: 42,
  duration_ms: 754000,
  best_score_at_end: 12800,
};

export const DEMO_SCORE: ScoreRecord = {
  score_id: 'demo-score-001',
  session_id: DEMO_SESSION.session_id,
  final_score: DEMO_SESSION.score,
  level_reached: DEMO_SESSION.level,
  lines_cleared: DEMO_SESSION.lines_cleared,
  achieved_at: DEMO_SESSION.ended_at ?? DEMO_SESSION.started_at,
  is_personal_best: true,
};

export const DEMO_REPLAY: ReplayEnvelope = {
  replay: {
    replay_id: 'demo-replay-001',
    session_id: DEMO_SESSION.session_id,
    engine_version: '0.1.0',
    seed: DEMO_SESSION.seed,
    tick_count: 2840,
    checksum: 'demo-checksum-001',
    created_at: DEMO_SESSION.ended_at ?? DEMO_SESSION.started_at,
  },
  events: [
    {
      event_id: 'demo-event-001',
      replay_id: 'demo-replay-001',
      tick: 4,
      command: 'move_left',
      payload_json: null,
    },
    {
      event_id: 'demo-event-002',
      replay_id: 'demo-replay-001',
      tick: 8,
      command: 'rotate_cw',
      payload_json: null,
    },
    {
      event_id: 'demo-event-003',
      replay_id: 'demo-replay-001',
      tick: 16,
      command: 'hard_drop',
      payload_json: null,
    },
  ],
};