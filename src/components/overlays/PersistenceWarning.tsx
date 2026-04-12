import type { DesktopStartupNotice } from '../../types/desktopPersistence';
import type { PersistenceWarning as PersistenceWarningType } from '../../types/persistence';

export interface PersistenceWarningProps {
  warning?: PersistenceWarningType;
  notice?: DesktopStartupNotice | null;
}

export function PersistenceWarning({ warning, notice }: PersistenceWarningProps) {
  const message = notice?.message ?? warning?.message;

  if (!message) {
    return null;
  }

  return (
    <div className="persistence-warning" role="status" aria-label="Persistence warning">
      <strong>{notice ? 'Persistence notice' : 'Persistence warning'}</strong>
      <p>{message}</p>
    </div>
  );
}

export default PersistenceWarning;