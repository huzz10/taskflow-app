import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { CheckCircleIcon, ClockIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

const statusStyles = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-100',
  completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-100',
};

const priorityStyles = {
  low: 'text-slate-500',
  medium: 'text-indigo-500',
  high: 'text-rose-500',
};

const TaskCard = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && dueDate < new Date() && task.status !== 'completed';

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-card dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{task.title}</h3>
          {task.description && (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{task.description}</p>
          )}
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusStyles[task.status]}`}
        >
          {task.status}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1">
          <ClockIcon className="h-4 w-4" />
          <span>
            Created {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
          </span>
        </div>

        {dueDate && (
          <div className={`flex items-center gap-1 ${isOverdue ? 'text-rose-500' : ''}`}>
            <ClockIcon className="h-4 w-4" />
            <span>Due {format(dueDate, 'PP')}</span>
          </div>
        )}

        <div className={`font-semibold ${priorityStyles[task.priority]}`}>Priority: {task.priority}</div>
      </div>

      <div className="flex items-center justify-end gap-3 text-sm">
        <button
          type="button"
          onClick={() => onToggleStatus(task)}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-200 px-3 py-1.5 font-medium text-emerald-600 hover:border-emerald-300 hover:text-emerald-700 dark:border-emerald-500/40 dark:text-emerald-300"
        >
          <CheckCircleIcon className="h-4 w-4" />
          {task.status === 'completed' ? 'Mark pending' : 'Mark complete'}
        </button>
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300"
        >
          <PencilSquareIcon className="h-4 w-4" />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(task)}
          className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-3 py-1.5 text-rose-600 hover:border-rose-300 hover:text-rose-700 dark:border-rose-500/40 dark:text-rose-300"
        >
          <TrashIcon className="h-4 w-4" />
          Delete
        </button>
      </div>
    </article>
  );
};

export default TaskCard;

