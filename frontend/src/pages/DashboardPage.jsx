import React, { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar.jsx';
import TaskForm from '../components/TaskForm.jsx';
import TaskFilters from '../components/TaskFilters.jsx';
import TaskCard from '../components/TaskCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import EmptyState from '../components/EmptyState.jsx';
import apiClient from '../utils/apiClient.js';

const defaultFilters = {
  status: '',
  priority: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  dueFrom: '',
  dueTo: '',
  q: '',
};

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const params = useMemo(() => {
    const query = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        query[key] = value;
      }
    });
    return query;
  }, [filters]);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get('/tasks', { params });
      setTasks(data.tasks);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, refreshIndex]);

  const handleCreateTask = async (payload) => {
    try {
      await apiClient.post('/tasks', payload);
      toast.success('Task created');
      setRefreshIndex((index) => index + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to create task');
      throw error;
    }
  };

  const handleUpdateTask = async (payload) => {
    try {
      await apiClient.put(`/tasks/${editingTask._id}`, payload);
      toast.success('Task updated');
      setEditingTask(null);
      setRefreshIndex((index) => index + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update task');
      throw error;
    }
  };

  const handleDeleteTask = async (task) => {
    const confirmed = window.confirm(`Delete task "${task.title}"?`);
    if (!confirmed) {
      return;
    }

    try {
      await apiClient.delete(`/tasks/${task._id}`);
      toast.success('Task deleted');
      setRefreshIndex((index) => index + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to delete task');
    }
  };

  const handleToggleStatus = async (task) => {
    try {
      await apiClient.put(`/tasks/${task._id}`, {
        status: task.status === 'completed' ? 'pending' : 'completed',
      });
      toast.success('Task updated');
      setRefreshIndex((index) => index + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update task');
    }
  };

  const hasTasks = tasks.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <section className="space-y-6">
            <TaskFilters onChange={setFilters} initialValue={defaultFilters} />
            {loading ? (
              <LoadingSpinner />
            ) : hasTasks ? (
              <div className="grid gap-4">
                {tasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={setEditingTask}
                    onDelete={handleDeleteTask}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No tasks found"
                description="Try adjusting your filters or create a new task to get started."
                action={
                  <button
                    type="button"
                    onClick={() => setEditingTask(null)}
                    className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500"
                  >
                    Create a task
                  </button>
                }
              />
            )}
          </section>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {editingTask ? 'Update task' : 'Create a new task'}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                {editingTask
                  ? 'Modify the details and save your changes.'
                  : 'Capture your next task and keep work flowing.'}
              </p>
              <div className="mt-5">
                <TaskForm
                  initialData={editingTask && editingTask._id ? editingTask : null}
                  onSubmit={editingTask && editingTask._id ? handleUpdateTask : handleCreateTask}
                  onCancel={editingTask ? () => setEditingTask(null) : undefined}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-indigo-600 p-6 text-white shadow-md dark:border-indigo-500/40 dark:bg-indigo-600/80">
              <h3 className="text-lg font-semibold">Organize your workflow</h3>
              <p className="mt-2 text-sm text-indigo-100">
                Use filters to focus on what matters right now. Prioritize tasks, track due dates, and celebrate your
                wins.
              </p>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;

