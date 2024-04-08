
import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskFilter from './components/TaskFilter';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    // Fetch tasks from backend API
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch('/api/tasks');
    const data = await res.json();
    setTasks(data);
    applyFilter(filter, data);
  };

  const addTask = async (task) => {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    const data = await res.json();
    setTasks([...tasks, data]);
    applyFilter(filter, [...tasks, data]);
  };

  const updateTask = async (id, updatedTask) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    });
    const data = await res.json();
    setTasks(
      tasks.map((task) =>
        task._id === id ? { ...task, status: data.status } : task
      )
    );
    applyFilter(filter, tasks);
  };

  const deleteTask = async (id) => {
    await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
    setTasks(tasks.filter((task) => task._id !== id));
    applyFilter(filter, tasks);
  };

  const applyFilter = (filter, tasks) => {
    let filteredTasks = [];
    switch (filter) {
      case 'To Do':
      case 'In Progress':
      case 'Done':
        filteredTasks = tasks.filter((task) => task.status === filter);
        break;
      default:
        filteredTasks = tasks;
        break;
    }
    setFilteredTasks(filteredTasks);
  };

  return (
    <div className='container'>
      <h1>Task Management Application</h1>
      <TaskForm addTask={addTask} />
      <TaskFilter filter={filter} setFilter={setFilter} />
      <TaskList
        tasks={filteredTasks}
        updateTask={updateTask}
        deleteTask={deleteTask}
      />
    </div>
  );
}

export default App;
