import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  deleteCandidate,
  getCandidates,
  updateCandidateStatus,
} from '../api/candidates';
import CandidateForm from '../components/CandidateForm';
import EditCandidateForm from '../components/EditCandidateForm';
import CandidateStatusHistory from '../components/CandidateStatusHistory';
import { isAdmin } from '../utils/auth';
import { exportCandidatesToCsv } from '../utils/exportCandidatesToCsv';
import { exportCandidatesToExcel } from '../utils/exportCandidatesToExcel';
import {
  candidateStatusClasses,
  candidateStatusLabels,
} from '../utils/candidateStatus';
import type { Candidate, CandidateStatus } from '../types/candidate';

const ITEMS_PER_PAGE = 10;

export default function CandidatesPage() {
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(
    null
  );
  const [historyCandidate, setHistoryCandidate] = useState<Candidate | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [unitFilter, setUnitFilter] = useState<string>('all');
  const [ageFilter, setAgeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const apiFilters = useMemo(() => {
    const filters: {
      month?: string;
      status?: string;
      position?: string;
      unit?: string;
      minAge?: number;
      maxAge?: number;
    } = {};

    if (monthFilter) {
      filters.month = monthFilter;
    }

    if (statusFilter !== 'all') {
      filters.status = statusFilter;
    }

    if (positionFilter !== 'all') {
      filters.position = positionFilter;
    }

    if (unitFilter !== 'all') {
      filters.unit = unitFilter;
    }

    if (ageFilter === '18-25') {
      filters.minAge = 18;
      filters.maxAge = 25;
    }

    if (ageFilter === '26-35') {
      filters.minAge = 26;
      filters.maxAge = 35;
    }

    if (ageFilter === '36+') {
      filters.minAge = 36;
    }

    return filters;
  }, [monthFilter, statusFilter, positionFilter, unitFilter, ageFilter]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['candidates', apiFilters],
    queryFn: () => getCandidates(apiFilters),
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
      queryClient.invalidateQueries({ queryKey: ['dashboard-candidates'] });
      toast.success('Статус кандидата оновлено');
    },
    onError: () => {
      toast.error('Не вдалося оновити статус');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (candidateId: string) => deleteCandidate(candidateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-candidates'] });
      setEditingCandidate(null);
      setHistoryCandidate(null);
      toast.success('Кандидата видалено');
    },
    onError: () => {
      toast.error('Не вдалося видалити кандидата');
    },
  });

  const filteredData = useMemo(() => {
    const candidates = data ?? [];
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return candidates;
    }

    return candidates.filter((candidate) => {
      return (
        candidate.fullName.toLowerCase().includes(normalizedSearch) ||
        candidate.phone.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [data, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  );

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage]);

  const handleDelete = (candidateId: string, candidateName: string) => {
    const confirmed = window.confirm(
      `Точно видалити кандидата "${candidateName}"?`
    );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(candidateId);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setMonthFilter('');
    setStatusFilter('all');
    setPositionFilter('all');
    setUnitFilter('all');
    setAgeFilter('all');
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    monthFilter,
    statusFilter,
    positionFilter,
    unitFilter,
    ageFilter,
  ]);

  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-2xl font-bold">Кандидати</h2>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            onClick={() => exportCandidatesToCsv(filteredData)}
            className="rounded-lg border px-4 py-2 hover:bg-gray-100"
            disabled={filteredData.length === 0}
          >
            Експорт CSV
          </button>

          <button
            onClick={() => exportCandidatesToExcel(filteredData)}
            className="rounded-lg border px-4 py-2 hover:bg-gray-100"
            disabled={filteredData.length === 0}
          >
            Експорт Excel
          </button>

          <button
            onClick={() => {
              setShowForm((prev) => !prev);
              setEditingCandidate(null);
              setHistoryCandidate(null);
            }}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {showForm ? 'Закрити форму' : 'Додати кандидата'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl bg-white p-5 shadow">
          <CandidateForm onSuccess={() => setShowForm(false)} />
        </div>
      )}

      {editingCandidate && (
        <div className="mb-6 rounded-xl bg-white p-5 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Редагування кандидата</h3>

            <button
              onClick={() => setEditingCandidate(null)}
              className="rounded border px-3 py-2 hover:bg-gray-100"
            >
              Закрити
            </button>
          </div>

          <EditCandidateForm
            candidate={editingCandidate}
            onSuccess={() => setEditingCandidate(null)}
            onCancel={() => setEditingCandidate(null)}
          />
        </div>
      )}

      {historyCandidate && (
        <div className="mb-6">
          <CandidateStatusHistory
            candidate={historyCandidate}
            onClose={() => setHistoryCandidate(null)}
          />
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Пошук по ПІБ або телефону"
          className="min-w-[240px] rounded border px-3 py-2 w-full"
        />

        <input
          type="month"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="rounded border px-3 py-2  w-full"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded border px-3 py-2 w-full"
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
          className="rounded border px-3 py-2 w-full"
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
          className="rounded border px-3 py-2 w-full"
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
          className="rounded border px-3 py-2 w-full"
        >
          <option value="all">Вік</option>
          <option value="18-25">18–25</option>
          <option value="26-35">26–35</option>
          <option value="36+">36+</option>
        </select>

        <button
          onClick={resetFilters}
          className="rounded border px-3 py-2 hover:bg-gray-100  w-full"
        >
          Скинути фільтри
        </button>
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
          <>
            <div className="overflow-x-auto">
              <table className="min-w-[1200px] w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left">ПІБ</th>
                    <th className="px-4 py-3 text-left">Вік</th>
                    <th className="px-4 py-3 text-left">Телефон</th>
                    <th className="px-4 py-3 text-left">Посада</th>
                    <th className="px-4 py-3 text-left">Підрозділ</th>
                    <th className="px-4 py-3 text-left">Статус</th>
                    <th className="px-4 py-3 text-left">Дата звернення</th>
                    <th className="px-4 py-3 text-left">Дата зарахування</th>
                    <th className="px-4 py-3 text-left">Дії</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedData.map((candidate) => (
                    <tr key={candidate._id} className="border-t">
                      <td className="px-4 py-3">
                        <Link
                          to={`/candidates/${candidate._id}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {candidate.fullName}
                        </Link>
                      </td>
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
                      <td className="px-4 py-3">
                        {candidate.dateOfContact
                          ? new Date(
                              candidate.dateOfContact
                            ).toLocaleDateString('uk-UA')
                          : '—'}
                      </td>
                      <td className="px-4 py-3">
                        {candidate.dateOfEnrollment
                          ? new Date(
                              candidate.dateOfEnrollment
                            ).toLocaleDateString('uk-UA')
                          : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => {
                              setEditingCandidate(candidate);
                              setShowForm(false);
                              setHistoryCandidate(null);
                            }}
                            className="rounded border px-3 py-1 text-sm hover:bg-gray-100"
                          >
                            Редагувати
                          </button>

                          <button
                            onClick={() => {
                              setHistoryCandidate(candidate);
                              setShowForm(false);
                              setEditingCandidate(null);
                            }}
                            className="rounded border px-3 py-1 text-sm hover:bg-gray-100"
                          >
                            Історія
                          </button>

                          {isAdmin() && (
                            <button
                              onClick={() =>
                                handleDelete(candidate._id, candidate.fullName)
                              }
                              className="rounded border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                              disabled={deleteMutation.isPending}
                            >
                              Видалити
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t px-4 py-3">
              <p className="text-sm text-gray-500">
                Показано {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} з{' '}
                {filteredData.length}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded border px-3 py-1 disabled:opacity-50"
                >
                  Назад
                </button>

                <span className="text-sm">
                  Сторінка {currentPage} / {totalPages}
                </span>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rounded border px-3 py-1 disabled:opacity-50"
                >
                  Далі
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
