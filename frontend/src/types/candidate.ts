export type CandidateStatus =
  | 'in_work'
  | 'documents'
  | 'vlk'
  | 'enrolled'
  | 'declined';

export type CandidateStatusHistoryItem = {
  fromStatus: CandidateStatus | null;
  toStatus: CandidateStatus;
  changedAt: string;
};

export type Candidate = {
  _id: string;
  fullName: string;
  birthDate: string;
  age: number;
  phone: string;
  position: string;
  unit: string;
  status: CandidateStatus;
  notes: string;
  statusHistory: CandidateStatusHistoryItem[];
  createdAt: string;
  updatedAt: string;
};
