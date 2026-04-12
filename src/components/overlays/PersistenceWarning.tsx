import type { PersistenceWarning as PersistenceWarningType } from '../../types/persistence';

export interface PersistenceWarningProps {
  warning: PersistenceWarningType;
}

export function PersistenceWarning({ warning }: PersistenceWarningProps) {
  return (
    <div className="persistence-warning" role="status" aria-label="Persistence warning">
      <strong>Persistence warning</strong>
      <p>{warning.message}</p>
    </div>
  );
}

export default PersistenceWarning;