import React, { useCallback } from 'react';
import { DisciplinaryRecord as LocalDisciplinaryRecord } from './types';
import { RecordModal } from '@/app/components/Modal';
import RecordCard from '@/app/components/Card';

// Import the specific union types from both components:
import type {
  TrainingRecord as CardTrainingRecord,
  DisciplinaryRecord as CardDisciplinaryRecord,
} from '@/app/components/Card';

import type {
  TrainingRecord as ModalTrainingRecord,
  DisciplinaryRecord as ModalDisciplinaryRecord,
} from '@/app/components/Modal';

interface DisciplinaryTabProps {
  employeeId: number | null;
  disciplinaryRecords: LocalDisciplinaryRecord[];
  showDisciplinaryModal: boolean;
  editingDisciplinaryRecord: LocalDisciplinaryRecord | null;
  onOpenDisciplinaryModal: (record?: LocalDisciplinaryRecord) => void;
  onCloseDisciplinaryModal: () => void;
  onSaveDisciplinaryRecord: (record: LocalDisciplinaryRecord) => void;
  onDeleteDisciplinaryRecord: (recordId: string) => void;
}

const EMPLOYEE_DISCIPLINARY_RECORDS_DOCUMENT = [
  { type: 'Disciplinary_Records', label: 'Disciplinary Records', description: 'Upload disciplinary records' },
];

const DisciplinaryTab: React.FC<DisciplinaryTabProps> = ({
  employeeId,
  disciplinaryRecords,
  showDisciplinaryModal,
  editingDisciplinaryRecord,
  onOpenDisciplinaryModal,
  onCloseDisciplinaryModal,
  onSaveDisciplinaryRecord,
  onDeleteDisciplinaryRecord,
}) => {
  // Adapter for Card.onEdit: accept Card's union type
  const handleCardEdit = useCallback(
    (r: CardTrainingRecord | CardDisciplinaryRecord) => {
      // This tab shows only disciplinary cards, so r will be CardDisciplinaryRecord.
      const d = r as CardDisciplinaryRecord;

      // Map only the fields your local type needs. (Attachments differ across components.)
      const local: LocalDisciplinaryRecord = {
        id: d.id,
        issue_date: d.issue_date,
        type_of_letter: d.type_of_letter,
        reason: d.reason,
        // If your local type includes attachments as EmployeeDocument[], you can
        // either omit them or map here if needed.
      };

      onOpenDisciplinaryModal(local);
    },
    [onOpenDisciplinaryModal]
  );

  // Adapter for Modal.onSave: accept Modal's union type
  const handleModalSave = useCallback(
    (r: ModalTrainingRecord | ModalDisciplinaryRecord) => {
      // For type="disciplinary", the modal will return a disciplinary record.
      const d = r as ModalDisciplinaryRecord;

      // If your local type matches Modal's for disciplinary, this cast is fine.
      onSaveDisciplinaryRecord(d as unknown as LocalDisciplinaryRecord);
    },
    [onSaveDisciplinaryRecord]
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Disciplinary Records</h3>
        <button className="btn btn-primary" onClick={() => onOpenDisciplinaryModal()}>
          Add Disciplinary Record
        </button>
      </div>

      {disciplinaryRecords.length === 0 ? (
        <div className="alert alert-info">No disciplinary records added yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {disciplinaryRecords.map((record) => (
            <RecordCard
              key={record.id}
              record={record}
              type="disciplinary"
              isEditing={true}
              onEdit={handleCardEdit}
              onDelete={onDeleteDisciplinaryRecord}
            />
          ))}
        </div>
      )}

      <RecordModal
        type="disciplinary"
        isOpen={showDisciplinaryModal}
        record={editingDisciplinaryRecord}
        onSave={handleModalSave}
        onCancel={onCloseDisciplinaryModal}
        employeeId={employeeId}
        documentTypes={EMPLOYEE_DISCIPLINARY_RECORDS_DOCUMENT}
        moduleName="employee-disciplinary"
      />
    </div>
  );
};

export default DisciplinaryTab;
