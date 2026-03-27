import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();

  const navLinkClass = (path: string) =>
    `px-3 py-2 rounded-lg ${
      location.pathname === path
        ? 'bg-blue-600 text-white'
        : 'text-gray-700 hover:bg-gray-200'
    }`;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
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
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}