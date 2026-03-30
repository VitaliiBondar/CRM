import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCandidateById } from '../api/candidates';
import CandidateStatusHistory from '../components/CandidateStatusHistory';
import { getCandidateStatusLabel } from '../utils/candidateStatus';

export default function CandidateDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['candidate', id],
    queryFn: () => getCandidateById(id!),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="rounded-xl bg-white p-5 shadow">
        <p className="text-gray-500">Завантаження...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl bg-white p-5 shadow">
        <p className="text-red-600">Не вдалося завантажити кандидата</p>
        <Link
          to="/candidates"
          className="mt-4 inline-block rounded border px-4 py-2 hover:bg-gray-100"
        >
          Назад до списку
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/candidates"
            className="mb-3 inline-block text-sm text-blue-600 hover:underline"
          >
            ← Назад до списку кандидатів
          </Link>

          <h2 className="text-2xl font-bold">{data.fullName}</h2>
          <p className="mt-1 text-sm text-gray-500">
            Поточний статус: <b>{getCandidateStatusLabel(data.status)}</b>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow">
          <h3 className="mb-4 text-lg font-semibold">Основна інформація</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">ПІБ</p>
              <p className="font-medium">{data.fullName}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Телефон</p>
              <p className="font-medium">{data.phone}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Дата народження</p>
              <p className="font-medium">
                {data.birthDate
                  ? new Date(data.birthDate).toLocaleDateString('uk-UA')
                  : '—'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Вік</p>
              <p className="font-medium">{data.age}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Посада</p>
              <p className="font-medium">{data.position}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Підрозділ</p>
              <p className="font-medium">{data.unit}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Дата звернення</p>
              <p className="font-medium">
                {data.dateOfContact
                  ? new Date(data.dateOfContact).toLocaleDateString('uk-UA')
                  : '—'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Дата зарахування</p>
              <p className="font-medium">
                {data.dateOfEnrollment
                  ? new Date(data.dateOfEnrollment).toLocaleDateString('uk-UA')
                  : '—'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Створено в системі</p>
              <p className="font-medium">
                {data.createdAt
                  ? new Date(data.createdAt).toLocaleString('uk-UA')
                  : '—'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Оновлено</p>
              <p className="font-medium">
                {data.updatedAt
                  ? new Date(data.updatedAt).toLocaleString('uk-UA')
                  : '—'}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <h3 className="mb-4 text-lg font-semibold">Нотатки</h3>

          <div className="min-h-[120px] rounded-lg border bg-gray-50 p-4 text-sm text-gray-700">
            {data.notes && data.notes.trim() !== ''
              ? data.notes
              : 'Нотаток поки немає'}
          </div>
        </div>
      </div>

      <CandidateStatusHistory candidate={data} />
    </div>
  );
}
