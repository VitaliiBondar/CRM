export type CandidateStatus =
  | 'in_work'
  | 'documents'
  | 'vlk'
  | 'enrolled'
  | 'declined';

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
  createdAt: string;
  updatedAt: string;
};