import React, { useCallback } from 'react';
import { TrainingRecord as LocalTrainingRecord } from './types';
import { TrainingModal } from '@/app/components/Modal';
import RecordCard from '@/app/components/Card';

// Bring in the specific types from Card and Modal so our adapters match their signatures
import type {
  TrainingRecord as CardTrainingRecord,
  DisciplinaryRecord as CardDisciplinaryRecord,
} from '@/app/components/Card';

import type {
  TrainingRecord as ModalTrainingRecord,
} from '@/app/components/Modal';

interface TrainingTabProps {
  employeeId: number | null;
  trainingRecords: LocalTrainingRecord[];
  showTrainingModal: boolean;
  editingTrainingRecord: LocalTrainingRecord | null;
  onOpenTrainingModal: (record?: LocalTrainingRecord) => void;
  onCloseTrainingModal: () => void;
  onSaveTrainingRecord: (record: LocalTrainingRecord) => void;
  onDeleteTrainingRecord: (recordId: string) => void;
}

const EMPLOYEE_TRAINING_RECORDS_DOCUMENT = [
  { type: 'Training_Records', label: 'Training Records', description: 'Upload training records' }
];

const TrainingTab: React.FC<TrainingTabProps> = ({
  employeeId,
  trainingRecords,
  showTrainingModal,
  editingTrainingRecord,
  onOpenTrainingModal,
  onCloseTrainingModal,
  onSaveTrainingRecord,
  onDeleteTrainingRecord,
}) => {

  // Adapter for Card.onEdit: the Card component will call us with its own union type.
  const handleCardEdit = useCallback(
    (r: CardTrainingRecord | CardDisciplinaryRecord) => {
      // In this tab we only render type="training" cards, so r is CardTrainingRecord.
      const ct = r as CardTrainingRecord;

      // Map fields that exist in your local TrainingRecord shape.
      // (Card attachments differ; omit or map if you need them.)
      const local: LocalTrainingRecord = {
        id: ct.id,
        training_course: ct.training_course,
        venue: ct.venue,
        start_datetime: ct.start_datetime,
        end_datetime: ct.end_datetime,
        status: ct.status,
        // has_bond / bond_* fields may or may not exist on Card's type;
        // only copy if you have them in your local records array already.
        has_bond: (ct as any).has_bond,
        bond_period_days: (ct as any).bond_period_days,
        bond_start_date: (ct as any).bond_start_date,
        bond_end_date: (ct as any).bond_end_date,
        bond_status: (ct as any).bond_status,
        // attachments: omit or transform here if required
      };

      onOpenTrainingModal(local);
    },
    [onOpenTrainingModal]
  );

  // Adapter for TrainingModal.onSave: Modal has its own TrainingRecord type too.
  const handleModalSave = useCallback(
    (r: ModalTrainingRecord) => {
      const local: LocalTrainingRecord = {
        id: r.id,
        training_course: r.training_course,
        venue: r.venue,
        start_datetime: r.start_datetime,
        end_datetime: r.end_datetime,
        status: r.status,
        has_bond: (r as any).has_bond,
        bond_period_days: (r as any).bond_period_days,
        bond_start_date: (r as any).bond_start_date,
        bond_end_date: (r as any).bond_end_date,
        bond_status: (r as any).bond_status,
        // attachments: r.attachments as needed, but note the type differences
      };

      onSaveTrainingRecord(local);
    },
    [onSaveTrainingRecord]
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Training Records</h3>
        <button className="btn btn-primary" onClick={() => onOpenTrainingModal()}>
          Add Training Record
        </button>
      </div>

      {trainingRecords.length === 0 ? (
        <div className="alert alert-info">No training records added yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainingRecords.map((record) => (
            <RecordCard
              key={record.id}
              record={record}
              type="training"
              isEditing={true}
              onEdit={handleCardEdit}
              onDelete={onDeleteTrainingRecord}
            />
          ))}
        </div>
      )}

      <TrainingModal
        isOpen={showTrainingModal}
        record={editingTrainingRecord as unknown as ModalTrainingRecord | null}
        onSave={handleModalSave}
        onCancel={onCloseTrainingModal}
        employeeId={employeeId}
        documentTypes={EMPLOYEE_TRAINING_RECORDS_DOCUMENT}
        moduleName="employee-training"
      />
    </div>
  );
};

export default TrainingTab;
