import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCandidates, updateCandidateStatus } from '../api/candidates';
import CandidateForm from '../components/CandidateForm';
import {
  candidateStatusClasses,
  candidateStatusLabels,
} from '../utils/candidateStatus';
import type { CandidateStatus } from '../types/candidate';

export default function CandidatesPage() {
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [unitFilter, setUnitFilter] = useState<string>('all');
  const [ageFilter, setAgeFilter] = useState<string>('all');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['candidates'],
    queryFn: getCandidates,
  });

  const statusMutation = useMutation({
    mutationFn: ({
      candidateId,
      status,
    }: {
      candidateId: string;
      status: CandidateStatus;
    }) => updateCandidateStatus(candidateId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
    },
  });

  const filteredData = (data ?? [])
    .filter((candidate) =>
      statusFilter === 'all' ? true : candidate.status === statusFilter
    )
    .filter((candidate) =>
      positionFilter === 'all' ? true : candidate.position === positionFilter
    )
    .filter((candidate) =>
      unitFilter === 'all' ? true : candidate.unit === unitFilter
    )
    .filter((candidate) => {
      if (ageFilter === 'all') return true;
      if (ageFilter === '18-25') {
        return candidate.age >= 18 && candidate.age <= 25;
      }
      if (ageFilter === '26-35') {
        return candidate.age >= 26 && candidate.age <= 35;
      }
      if (ageFilter === '36+') {
        return candidate.age >= 36;
      }
      return true;
    });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Кандидати</h2>

        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          {showForm ? 'Закрити форму' : 'Додати кандидата'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl bg-white p-5 shadow">
          <CandidateForm onSuccess={() => setShowForm(false)} />
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded border px-3 py-2"
        >
          <option value="all">Усі статуси</option>
          <option value="in_work">В роботі</option>
          <option value="documents">Збір документів</option>
          <option value="vlk">ВЛК</option>
          <option value="enrolled">Зарахований</option>
          <option value="declined">Відмовився</option>
        </select>

        <select
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
          className="rounded border px-3 py-2"
        >
          <option value="all">Усі посади</option>
          {[
            ...new Set((data ?? []).map((candidate) => candidate.position)),
          ].map((position) => (
            <option key={position} value={position}>
              {position}
            </option>
          ))}
        </select>

        <select
          value={unitFilter}
          onChange={(e) => setUnitFilter(e.target.value)}
          className="rounded border px-3 py-2"
        >
          <option value="all">Усі підрозділи</option>
          {[...new Set((data ?? []).map((candidate) => candidate.unit))].map(
            (unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            )
          )}
        </select>

        <select
          value={ageFilter}
          onChange={(e) => setAgeFilter(e.target.value)}
          className="rounded border px-3 py-2"
        >
          <option value="all">Вік</option>
          <option value="18-25">18–25</option>
          <option value="26-35">26–35</option>
          <option value="36+">36+</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow">
        {isLoading && <div className="p-4 text-gray-500">Завантаження...</div>}

        {isError && (
          <div className="p-4 text-red-600">
            Помилка при завантаженні кандидатів
          </div>
        )}

        {!isLoading && !isError && filteredData.length === 0 && (
          <div className="p-4 text-gray-500">Кандидатів не знайдено</div>
        )}

        {!isLoading && !isError && filteredData.length > 0 && (
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">ПІБ</th>
                <th className="px-4 py-3 text-left">Вік</th>
                <th className="px-4 py-3 text-left">Телефон</th>
                <th className="px-4 py-3 text-left">Посада</th>
                <th className="px-4 py-3 text-left">Підрозділ</th>
                <th className="px-4 py-3 text-left">Статус</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((candidate) => (
                <tr key={candidate._id} className="border-t">
                  <td className="px-4 py-3">{candidate.fullName}</td>
                  <td className="px-4 py-3">{candidate.age}</td>
                  <td className="px-4 py-3">{candidate.phone}</td>
                  <td className="px-4 py-3">{candidate.position}</td>
                  <td className="px-4 py-3">{candidate.unit}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${candidateStatusClasses[candidate.status]}`}
                      >
                        {candidateStatusLabels[candidate.status]}
                      </span>

                      <select
                        value={candidate.status}
                        onChange={(e) =>
                          statusMutation.mutate({
                            candidateId: candidate._id,
                            status: e.target.value as CandidateStatus,
                          })
                        }
                        className="rounded border px-2 py-1 text-xs"
                        disabled={statusMutation.isPending}
                      >
                        <option value="in_work">В роботі</option>
                        <option value="documents">Збір документів</option>
                        <option value="vlk">ВЛК</option>
                        <option value="enrolled">Зарахований</option>
                        <option value="declined">Відмовився</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
