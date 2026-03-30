import React from 'react';
import type { Candidate } from '../types/candidate';
import {
  candidateStatusClasses,
  getCandidateStatusLabel,
} from '../utils/candidateStatus';

type CandidateStatusHistoryProps = {
  candidate: Candidate;
  onClose?: () => void;
};

export default function CandidateStatusHistory({
  candidate,
  onClose,
}: CandidateStatusHistoryProps): React.JSX.Element {
  const sortedHistory = [...(candidate.statusHistory ?? [])].sort(
    (a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
  );

  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Історія статусів</h3>
          <p className="text-sm text-gray-500">{candidate.fullName}</p>
        </div>

        <button
          onClick={onClose}
          className="rounded border px-3 py-2 hover:bg-gray-100"
        >
          Закрити
        </button>
      </div>

      {sortedHistory.length === 0 ? (
        <p className="text-gray-500">Історія відсутня</p>
      ) : (
        <div className="space-y-3">
          {sortedHistory.map((item, index) => (
            <div
              key={`${item.changedAt}-${index}`}
              className="rounded-lg border p-3"
            >
              <div className="mb-2 text-sm text-gray-500">
                {new Date(item.changedAt).toLocaleString('uk-UA')}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-gray-600">Зі статусу:</span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {getCandidateStatusLabel(item.fromStatus)}
                </span>

                <span className="text-gray-600">→</span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    candidateStatusClasses[item.toStatus]
                  }`}
                >
                  {getCandidateStatusLabel(item.toStatus)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
