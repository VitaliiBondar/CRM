import React from 'react';

export default function CandidatesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Кандидати</h2>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Додати кандидата
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <p className="text-gray-500">Тут буде таблиця кандидатів</p>
      </div>
    </div>
  );
}