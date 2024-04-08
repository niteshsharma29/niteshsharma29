const express = require('express');
const mongoose = require('mongoose');
const Task = require('./models/Task');

const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost/task-manager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post('/api/tasks', async (req, res) => {
  const { title, description, status } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }
  const task = new Task({ title, description, status });
  const savedTask = await task.save();
  res.json(savedTask);
});

app.put('/api/tasks/:id', async (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }
  const task = await Task.findById(req.params.id);
  task.status = status;
  const updatedTask = await task.save();
  res.json(updatedTask);
});

app.delete('/api/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));