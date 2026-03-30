import type { Candidate } from '../types/candidate';
import { getCandidateStatusLabel } from './candidateStatus';

const escapeCsvValue = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined) {
    return '""';
  }

  const stringValue = String(value).replace(/"/g, '""');
  return `"${stringValue}"`;
};

const formatDate = (value: string | null | undefined): string => {
  if (!value) {
    return '';
  }

  return new Date(value).toLocaleDateString('uk-UA');
};

export const exportCandidatesToCsv = (candidates: Candidate[]) => {
  const headers = [
    'ПІБ',
    'Дата народження',
    'Вік',
    'Телефон',
    'Посада',
    'Підрозділ',
    'Статус',
    'Дата звернення',
    'Дата зарахування',
    'Нотатки',
  ];

  const rows = candidates.map((candidate) => [
    candidate.fullName,
    formatDate(candidate.birthDate),
    candidate.age,
    candidate.phone,
    candidate.position,
    candidate.unit,
    getCandidateStatusLabel(candidate.status),
    formatDate(candidate.dateOfContact),
    formatDate(candidate.dateOfEnrollment),
    candidate.notes ?? '',
  ]);

  const csvContent = [
    headers.map(escapeCsvValue).join(','),
    ...rows.map((row) => row.map(escapeCsvValue).join(',')),
  ].join('\n');

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const now = new Date();
  const fileName = `candidates_${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.csv`;

  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};
