import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { clearAuth, getUser } from '../utils/auth';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();

  const navLinkClass = (path: string) =>
    `px-3 py-2 rounded-lg ${
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
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-gray-800">Recruiting CRM</h1>

            <nav className="flex gap-2">
              <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                Дашборд
              </Link>
              <Link to="/candidates" className={navLinkClass('/candidates')}>
                Кандидати
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user?.fullName ?? 'Користувач'}
            </span>

            <button
              onClick={handleLogout}
              className="rounded border px-3 py-2 text-sm hover:bg-gray-100"
            >
              Вийти
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
