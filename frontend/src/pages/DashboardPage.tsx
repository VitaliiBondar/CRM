import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getCandidates } from '../api/candidates';
import { candidateStatusLabels } from '../utils/candidateStatus';

const STATUS_COLORS: Record<string, string> = {
  in_work: '#2563eb',
  documents: '#ca8a04',
  vlk: '#9333ea',
  enrolled: '#16a34a',
  declined: '#dc2626',
};

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

  const statusChartData = useMemo(() => {
    return [
      {
        key: 'in_work',
        name: candidateStatusLabels.in_work,
        value: stats.inWork,
      },
      {
        key: 'documents',
        name: candidateStatusLabels.documents,
        value: stats.documents,
      },
      {
        key: 'vlk',
        name: candidateStatusLabels.vlk,
        value: stats.vlk,
      },
      {
        key: 'enrolled',
        name: candidateStatusLabels.enrolled,
        value: stats.enrolled,
      },
      {
        key: 'declined',
        name: candidateStatusLabels.declined,
        value: stats.declined,
      },
    ];
  }, [stats]);

  const unitChartData = useMemo(() => {
    const candidates = data ?? [];
    const unitsMap = new Map<string, number>();

    for (const candidate of candidates) {
      const current = unitsMap.get(candidate.unit) ?? 0;
      unitsMap.set(candidate.unit, current + 1);
    }

    return Array.from(unitsMap.entries())
      .map(([unit, count]) => ({
        unit,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [data]);

  const monthlyContactsData = useMemo(() => {
    const candidates = data ?? [];
    const monthMap = new Map<string, number>();

    for (const candidate of candidates) {
      if (!candidate.dateOfContact) continue;

      const date = new Date(candidate.dateOfContact);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const key = `${year}-${month}`;

      const current = monthMap.get(key) ?? 0;
      monthMap.set(key, current + 1);
    }

    return Array.from(monthMap.entries())
      .map(([month, count]) => ({
        month,
        count,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [data]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
        <div className="rounded-xl bg-white p-4 text-gray-500 shadow">
          Завантаження...
        </div>
      )}

      {isError && (
        <div className="rounded-xl bg-white p-4 text-red-600 shadow">
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

          <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="rounded-xl bg-white p-5 shadow">
              <h3 className="mb-4 text-lg font-semibold">
                Розподіл по статусах
              </h3>

              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {statusChartData.map((entry) => (
                        <Cell key={entry.key} fill={STATUS_COLORS[entry.key]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-xl bg-white p-5 shadow">
              <h3 className="mb-4 text-lg font-semibold">
                Кандидати по підрозділах
              </h3>

              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={unitChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="unit" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Кількість" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-xl bg-white p-5 shadow">
            <h3 className="mb-4 text-lg font-semibold">
              Динаміка звернень по місяцях
            </h3>

            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyContactsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Звернення"
                    stroke="#2563eb"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
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
