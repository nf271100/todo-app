"use client";

import { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaEdit, FaSave, FaTrashAlt } from 'react-icons/fa'; // Icons
import TodoInput from './TodoInput';

type Task = {
  _id: string;
  text: string;
  completed: boolean;
};

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskText, setEditingTaskText] = useState<string>('');

  // Fetch tasks from MongoDB
  useEffect(() => {
    async function fetchTasks() {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      setTasks(data.tasks);
    }
    fetchTasks();
  }, []);

  // Add a task to the database with validation
  const addTask = async (taskText: string) => {
    if (taskText.trim() === '') {
      alert('Task text cannot be empty');
      return;
    }

    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskText }),
    });

    if (response.status === 400) {
      const data = await response.json();
      alert(data.message);
    } else {
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
    }
  };
// Toggle task completion
const toggleTask = async (taskId: string, completed: boolean) => {
  try {
    const response = await fetch('/api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, completed }),
    });

    if (!response.ok) {
      throw new Error('Failed to update task');
    }

    const updatedTask = await response.json();

    // Update the task in local state with the response from the server
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task._id === taskId ? { ...task, completed: updatedTask.completed } : task))
    );
  } catch (error) {
    console.error('Error toggling task completion:', error);
    alert('There was an error updating the task. Please try again.');
  }
};


  // Delete task
  const deleteTask = async (taskId: string) => {
    const response = await fetch('/api/tasks', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId }),
    });
    await response.json();
    setTasks(tasks.filter((task) => task._id !== taskId));
  };

  // Edit task text
  const editTask = async (taskId: string) => {
    if (editingTaskText.trim() === '') {
      alert('Task text cannot be empty');
      return;
    }

    const response = await fetch('/api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, taskText: editingTaskText }),
    });

    await response.json();
    setTasks(tasks.map((task) => (task._id === taskId ? { ...task, text: editingTaskText } : task)));
    setEditingTaskId(null);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') {
      return task.completed;
    } else if (filter === 'incomplete') {
      return !task.completed;
    }
    return true;
  });

  return (
    <div className="max-w-lg mx-auto p-6 bg-green-100 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-900 animate-popIn">To-Do List</h1>

      <TodoInput onAddTask={addTask} />

      {/* Filter buttons */}
      <div className="flex justify-center space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded-md ${filter === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
        <button
          className={`px-4 py-2 rounded-md ${filter === 'incomplete' ? 'bg-red-500 text-white' : 'bg-gray-300'}`}
          onClick={() => setFilter('incomplete')}
        >
          Incomplete
        </button>
      </div>

      <ul className="space-y-4">
        {filteredTasks.map((task) => (
          <li
            key={task._id}
            className="flex justify-between items-center bg-gray-100 p-4 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            {editingTaskId === task._id ? (
              <input
                type="text"
                value={editingTaskText}
                onChange={(e) => setEditingTaskText(e.target.value)}
                className="border border-gray-300 p-2 rounded-md"
              />
            ) : (
              <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                {task.text}
              </span>
            )}
            <div className="flex space-x-2">
              {editingTaskId === task._id ? (
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-200"
                  onClick={() => editTask(task._id)}
                >
                  <FaSave className="inline-block mr-1" /> Save
                </button>
              ) : (
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-200"
                  onClick={() => {
                    setEditingTaskId(task._id);
                    setEditingTaskText(task.text);
                  }}
                >
                  <FaEdit className="inline-block mr-1" /> Edit
                </button>
              )}
              <button
                className={`px-4 py-2 rounded-md ${task.completed ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'}`}
                onClick={() => toggleTask(task._id, !task.completed)}
              >
                {task.completed ? (
                  <>
                    <FaTimesCircle className="inline-block mr-1" /> Undo
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="inline-block mr-1" /> Complete
                  </>
                )}
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                onClick={() => deleteTask(task._id)}
              >
                <FaTrashAlt className="inline-block mr-1" /> Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
