import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import ThemeToggle from './ThemeToggle.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white/70 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div>
          <span className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">TaskFlow</span>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden sm:flex flex-col text-right text-sm text-slate-600 dark:text-slate-300">
              <span className="font-medium text-slate-800 dark:text-white">{user.name}</span>
              <span>{user.email}</span>
            </div>
          )}
          <ThemeToggle />
          <button
            type="button"
            onClick={logout}
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

