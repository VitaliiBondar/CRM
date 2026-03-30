import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import type { Candidate } from '../types/candidate';
import { getCandidateStatusLabel } from './candidateStatus';

const formatDate = (value: string | null | undefined): string => {
  if (!value) {
    return '';
  }

  return new Date(value).toLocaleDateString('uk-UA');
};

export const exportCandidatesToExcel = (candidates: Candidate[]) => {
  const rows = candidates.map((candidate) => ({
    ПІБ: candidate.fullName,
    'Дата народження': formatDate(candidate.birthDate),
    Вік: candidate.age,
    Телефон: candidate.phone,
    Посада: candidate.position,
    Підрозділ: candidate.unit,
    Статус: getCandidateStatusLabel(candidate.status),
    'Дата звернення': formatDate(candidate.dateOfContact),
    'Дата зарахування': formatDate(candidate.dateOfEnrollment),
    Нотатки: candidate.notes ?? '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Кандидати');

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });

  const fileData = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const now = new Date();
  const fileName = `candidates_${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.xlsx`;

  saveAs(fileData, fileName);
};
