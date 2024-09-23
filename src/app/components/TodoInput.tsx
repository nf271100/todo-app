"use client";

import { useState } from "react";

export default function TodoInput({ onAddTask }: { onAddTask: (task: string) => void }) {
  const [task, setTask] = useState("");

  const handleAddTask = () => {
    if (task.trim()) {
      onAddTask(task);
      setTask("");
    }
  };

  return (
    <div className="flex space-x-4 mb-4">
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter a new task"
        className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleAddTask}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
      >
        Add Task
      </button>
    </div>
  );

}
