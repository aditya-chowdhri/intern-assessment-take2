import React, { useState } from "react";
import "./Taskbar.css"; // Import the CSS file
// Pass the onCreate function which makes a server call in app.js
const Taskbar = ({ onCreate }) => {
  // Initial title which is set to nothing
  const [taskTitle, setTaskTitle] = useState("");

  // Handle creation of task similar to updating its title 
  const handleCreate = () => {
    if (!taskTitle.trim()) return;
    onCreate(taskTitle);
    setTaskTitle("");
  };

  return (
    <div className="taskbar">

      <input
        type="text"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        placeholder="Enter new task"
        className="taskbar-input"
      />
      {/* Create the task using the function passed in from app.js */}
      <button onClick={handleCreate} className="taskbar-button">
        Create Task
      </button>
    </div>
  );
};

export default Taskbar;
