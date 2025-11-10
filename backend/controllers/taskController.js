import Task from '../models/Task.js';

export const getTasks = async (req, res) => {
  const { status, priority, dueFrom, dueTo, sortBy = 'createdAt', sortOrder = 'desc', q } = req.query;

  const query = { user: req.user._id };

  if (status) {
    query.status = status;
  }

  if (priority) {
    query.priority = priority;
  }

  const parsedDueFrom = dueFrom ? new Date(dueFrom) : null;
  const parsedDueTo = dueTo ? new Date(dueTo) : null;

  if (parsedDueFrom instanceof Date && !Number.isNaN(parsedDueFrom.valueOf())) {
    query.dueDate = { ...(query.dueDate || {}), $gte: parsedDueFrom };
  }

  if (parsedDueTo instanceof Date && !Number.isNaN(parsedDueTo.valueOf())) {
    query.dueDate = { ...(query.dueDate || {}), $lte: parsedDueTo };
  }

  if (q) {
    query.title = { $regex: q, $options: 'i' };
  }

  const sortFields = ['dueDate', 'createdAt'];
  const sortField = sortFields.includes(sortBy) ? sortBy : 'createdAt';
  const sortDirection = sortOrder === 'asc' ? 1 : -1;

  const tasks = await Task.find(query)
    .sort({ [sortField]: sortDirection, _id: -1 })
    .lean();

  res.json({ tasks });
};

export const createTask = async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Task title is required');
  }

  const task = await Task.create({
    user: req.user._id,
    title,
    description,
    status,
    priority,
    dueDate: dueDate ? new Date(dueDate) : undefined,
  });

  res.status(201).json({ task });
};

export const getTaskById = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.json({ task });
};

export const updateTask = async (req, res) => {
  const updates = req.body;
  const allowedFields = ['title', 'description', 'status', 'priority', 'dueDate'];
  const sanitizedUpdates = {};

  Object.keys(updates).forEach((key) => {
    if (allowedFields.includes(key)) {
      sanitizedUpdates[key] = updates[key];
    }
  });

  if (Object.prototype.hasOwnProperty.call(sanitizedUpdates, 'dueDate')) {
    sanitizedUpdates.dueDate = sanitizedUpdates.dueDate ? new Date(sanitizedUpdates.dueDate) : null;
  }

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { $set: sanitizedUpdates },
    { new: true, runValidators: true }
  );

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.json({ task });
};

export const deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.json({ message: 'Task deleted' });
};

