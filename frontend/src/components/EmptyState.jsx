import React from 'react';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

const EmptyState = ({ title, description, action }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900/70">
    <ClipboardDocumentListIcon className="h-12 w-12 text-slate-400 dark:text-slate-500" />
    <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p>
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export default EmptyState;

