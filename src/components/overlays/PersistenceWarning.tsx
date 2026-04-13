import type { PersistenceWarning as PersistenceWarningType } from '../../types/persistence';

export interface PersistenceWarningProps {
  warning: PersistenceWarningType;
}

function getWarningHeading(code: PersistenceWarningType['code']): string {
  switch (code) {
    case 'desktop_bridge_unavailable':
      return 'Desktop persistence unavailable';
    case 'desktop_data_unreadable':
    case 'desktop_data_invalid':
      return 'Desktop best score reset';
    case 'desktop_write_permission_denied':
    case 'desktop_write_locked':
    case 'desktop_write_no_space':
    case 'desktop_write_failed':
      return 'Desktop save warning';
    default:
      return 'Persistence warning';
  }
}

function getWarningGuidance(code: PersistenceWarningType['code']): string | null {
  switch (code) {
    case 'desktop_bridge_unavailable':
    case 'desktop_persistence_disabled':
      return 'Gameplay can continue, but best score changes will not survive restart until the desktop bridge is available again.';
    case 'desktop_data_unreadable':
    case 'desktop_data_invalid':
      return 'The app loaded with the default best score for this run. Existing browser data was not imported.';
    case 'desktop_write_permission_denied':
      return 'Check folder permissions for the desktop app data directory, then relaunch to restore saves.';
    case 'desktop_write_locked':
      return 'Close any other process holding the desktop data file, then relaunch to restore saves.';
    case 'desktop_write_no_space':
      return 'Free disk space on the local machine before the next relaunch if you need best-score saves to persist.';
    case 'desktop_write_failed':
      return 'The last committed desktop database remains intact, but the latest best-score update may not persist after restart.';
    default:
      return null;
  }
}

export function PersistenceWarning({ warning }: PersistenceWarningProps) {
  const guidance = getWarningGuidance(warning.code);

  return (
    <div className="persistence-warning" role="status" aria-label="Persistence warning">
      <strong>{getWarningHeading(warning.code)}</strong>
      <p>{warning.message}</p>
      {guidance ? <p>{guidance}</p> : null}
    </div>
  );
}

export default PersistenceWarning;