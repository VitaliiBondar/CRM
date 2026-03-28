import type { CandidateStatus } from '../types/candidate';

export const candidateStatusLabels: Record<CandidateStatus, string> = {
  in_work: 'В роботі',
  documents: 'Збір документів',
  vlk: 'ВЛК',
  enrolled: 'Зарахований',
  declined: 'Відмовився',
};

export const candidateStatusClasses: Record<CandidateStatus, string> = {
  in_work: 'bg-blue-100 text-blue-700',
  documents: 'bg-yellow-100 text-yellow-700',
  vlk: 'bg-purple-100 text-purple-700',
  enrolled: 'bg-green-100 text-green-700',
  declined: 'bg-red-100 text-red-700',
};