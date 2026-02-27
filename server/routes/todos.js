import express from 'express';
import Todo from '../models/Todo.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Create Todo
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title required' });
    }

    const todo = await Todo.create({
      userId: req.userId,
      title,
      description,
      dueDate,
      priority: priority || 'medium'
    });

    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create todo', error: error.message });
  }
});

// Get all todos for user
router.get('/', verifyToken, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.userId }).sort({ dueDate: 1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch todos', error: error.message });
  }
});

// Get single todo
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo || todo.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch todo', error: error.message });
  }
});

// Update todo
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { title, description, dueDate, priority, completed } = req.body;

    const todo = await Todo.findById(req.params.id);

    if (!todo || todo.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    if (title) todo.title = title;
    if (description) todo.description = description;
    if (dueDate) todo.dueDate = dueDate;
    if (priority) todo.priority = priority;
    if (completed !== undefined) todo.completed = completed;
    todo.updatedAt = new Date();

    await todo.save();
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update todo', error: error.message });
  }
});

// Delete todo
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo || todo.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    await Todo.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete todo', error: error.message });
  }
});

export default router;
