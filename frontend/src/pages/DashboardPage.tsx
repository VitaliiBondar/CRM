import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCandidates } from '../api/candidates';
import { candidateStatusLabels } from '../utils/candidateStatus';

export default function DashboardPage() {
  const [monthFilter, setMonthFilter] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard-candidates', monthFilter],
    queryFn: () =>
      getCandidates(
        monthFilter
          ? {
              month: monthFilter,
            }
          : {}
      ),
  });

  const stats = useMemo(() => {
    const candidates = data ?? [];

    return {
      total: candidates.length,
      inWork: candidates.filter((candidate) => candidate.status === 'in_work')
        .length,
      documents: candidates.filter(
        (candidate) => candidate.status === 'documents'
      ).length,
      vlk: candidates.filter((candidate) => candidate.status === 'vlk').length,
      enrolled: candidates.filter(
        (candidate) => candidate.status === 'enrolled'
      ).length,
      declined: candidates.filter(
        (candidate) => candidate.status === 'declined'
      ).length,
    };
  }, [data]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Дашборд</h2>

        <div className="flex items-center gap-3">
          <input
            type="month"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="rounded border px-3 py-2"
          />

          <button
            onClick={() => setMonthFilter('')}
            className="rounded border px-3 py-2 hover:bg-gray-100"
          >
            Скинути
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="rounded-xl bg-white p-4 shadow text-gray-500">
          Завантаження...
        </div>
      )}

      {isError && (
        <div className="rounded-xl bg-white p-4 shadow text-red-600">
          Помилка при завантаженні аналітики
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
            <div className="rounded-xl bg-white p-5 shadow">
              <p className="text-sm text-gray-500">Усього кандидатів</p>
              <p className="mt-2 text-3xl font-bold text-blue-600">
                {stats.total}
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 shadow">
              <p className="text-sm text-gray-500">
                {candidateStatusLabels.in_work}
              </p>
              <p className="mt-2 text-3xl font-bold text-sky-600">
                {stats.inWork}
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 shadow">
              <p className="text-sm text-gray-500">
                {candidateStatusLabels.documents}
              </p>
              <p className="mt-2 text-3xl font-bold text-yellow-600">
                {stats.documents}
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 shadow">
              <p className="text-sm text-gray-500">
                {candidateStatusLabels.vlk}
              </p>
              <p className="mt-2 text-3xl font-bold text-purple-600">
                {stats.vlk}
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 shadow">
              <p className="text-sm text-gray-500">
                {candidateStatusLabels.enrolled}
              </p>
              <p className="mt-2 text-3xl font-bold text-green-600">
                {stats.enrolled}
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 shadow">
              <p className="text-sm text-gray-500">
                {candidateStatusLabels.declined}
              </p>
              <p className="mt-2 text-3xl font-bold text-red-600">
                {stats.declined}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <h3 className="mb-4 text-lg font-semibold">Короткий підсумок</h3>

            <div className="space-y-2 text-sm text-gray-700">
              <p>
                За вибраний період в системі: <b>{stats.total}</b> кандидатів.
              </p>
              <p>
                На етапі <b>{candidateStatusLabels.in_work}</b>:{' '}
                <b>{stats.inWork}</b>
              </p>
              <p>
                На етапі <b>{candidateStatusLabels.documents}</b>:{' '}
                <b>{stats.documents}</b>
              </p>
              <p>
                На етапі <b>{candidateStatusLabels.vlk}</b>: <b>{stats.vlk}</b>
              </p>
              <p>
                <b>{candidateStatusLabels.enrolled}</b>: <b>{stats.enrolled}</b>
              </p>
              <p>
                <b>{candidateStatusLabels.declined}</b>: <b>{stats.declined}</b>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
