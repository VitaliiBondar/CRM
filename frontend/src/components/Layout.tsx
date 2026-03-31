import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { clearAuth, getUser, isAdmin } from '../utils/auth';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();

  const navLinkClass = (path: string) =>
    `whitespace-nowrap rounded-lg px-3 py-2 ${
      location.pathname === path
        ? 'bg-blue-600 text-white'
        : 'text-gray-700 hover:bg-gray-200'
    }`;

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
              <h1 className="text-xl font-bold text-gray-800">
                Recruiting CRM
              </h1>

              <nav className="flex flex-wrap gap-2">
                <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                  Дашборд
                </Link>

                <Link to="/candidates" className={navLinkClass('/candidates')}>
                  Кандидати
                </Link>

                {isAdmin() && (
                  <Link to="/users" className={navLinkClass('/users')}>
                    Користувачі
                  </Link>
                )}
              </nav>
            </div>

            <div className="flex items-center justify-between gap-4 lg:justify-end">
              <div className="text-right text-sm text-gray-600">
                <div>{user?.fullName ?? 'Користувач'}</div>
                <div className="text-xs text-gray-400">
                  {user?.role === 'admin' ? 'Адміністратор' : 'Рекрутер'}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="rounded border px-3 py-2 text-sm hover:bg-gray-100"
              >
                Вийти
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
