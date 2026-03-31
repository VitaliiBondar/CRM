import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../api/users';
import UserForm from '../components/UserForm';

export default function UsersPage() {
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Користувачі</h2>

        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 sm:w-auto"
        >
          {showForm ? 'Закрити форму' : 'Додати користувача'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl bg-white p-5 shadow">
          <UserForm onSuccess={() => setShowForm(false)} />
        </div>
      )}

      <div className="overflow-hidden rounded-xl bg-white shadow">
        {isLoading && <div className="p-4 text-gray-500">Завантаження...</div>}

        {isError && (
          <div className="p-4 text-red-600">
            Помилка при завантаженні користувачів
          </div>
        )}

        {!isLoading && !isError && data && data.length === 0 && (
          <div className="p-4 text-gray-500">Користувачів поки немає</div>
        )}

        {!isLoading && !isError && data && data.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-[700px] w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">ПІБ</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Роль</th>
                  <th className="px-4 py-3 text-left">Створено</th>
                </tr>
              </thead>
              <tbody>
                {data.map((user) => (
                  <tr key={user._id} className="border-t">
                    <td className="px-4 py-3">{user.fullName}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">
                      {user.role === 'admin' ? 'Адміністратор' : 'Рекрутер'}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(user.createdAt).toLocaleDateString('uk-UA')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
