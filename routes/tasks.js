const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.render('tasks/index', { 
      title: 'All Tasks',
      page: 'tasks',
      tasks 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Show create task form
router.get('/new', (req, res) => {
  res.render('tasks/new', { 
    title: 'New Task',
    page: 'tasks'
  });
});

// Create new task
router.post('/', async (req, res) => {
  try {
    // Handle tags if provided as comma-separated string
    if (req.body.tags && typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
    
    const task = new Task(req.body);
    await task.save();
    res.redirect('/tasks');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Show single task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).render('404', { title: 'Task Not Found' });
    }
    res.render('tasks/show', { 
      title: task.title,
      page: 'tasks',
      task 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Show edit task form
router.get('/:id/edit', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).render('404', { title: 'Task Not Found' });
    }
    res.render('tasks/edit', { 
      title: 'Edit Task',
      page: 'tasks',
      task 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/tasks/${req.params.id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect('/tasks');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
