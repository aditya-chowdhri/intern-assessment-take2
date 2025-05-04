import React, { useCallback, useState, useEffect } from "react";
import "./App.css";
import Task from "./components/Task"
import TaskBar from "./components/Taskbar"; 

const App = () => {
    const [items, setItems] = useState([]);
    const [taskStatus, setTaskStatus] = useState("all");


    const handleToggle = useCallback((taskId) => {
      fetch(`http://localhost:3000/tasks/togglestatus?taskId=${taskId}`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((updatedTask) => {
          setItems((prevItems) =>
            prevItems.map((item) =>
              item.id === updatedTask.id ? updatedTask : item
            )
          );
        })
    }, []);

    const handleDelete = useCallback((taskId) => {
      fetch(`http://localhost:3000/tasks/deletetask?taskId=${taskId}`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then(() => {
          setItems((prevItems) => prevItems.filter((item) => item.id !== taskId));
        })
    }, []);

    const handleCreate = useCallback((taskTitle) => {
      fetch(`http://localhost:3000/tasks/create?taskTitle=${taskTitle}`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((newTask) => {
          setItems((prevItems) => [...prevItems, newTask]);
        });
    }, []);
    
    const handleEdit = useCallback((taskId, newTitle) => {
      fetch(`http://localhost:3000/tasks/updatetitle?taskId=${taskId}&newTitle=${encodeURIComponent(newTitle)}`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((updatedTask) => {
          setItems((prevItems) =>
            prevItems.map((item) =>
              item.id === updatedTask.id ? updatedTask : item
            )
          );
        });
    }, []);
    

    useEffect(() => {
        fetch(`http://localhost:3000/tasks/get?taskstatus=${taskStatus}&page=1`)
            .then((res) => res.json())
            .then((json) => {
                setItems(json);
            });
    }, [taskStatus]); 


    

    return (
        <div className="App">
            <h1>To-Do List</h1>
            <TaskBar onCreate={handleCreate} /> 
            <div>
              <select
                id="statusFilter"
                value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value)}
              >
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="container">
                {items.map((item) => (
                    <div className="item" key={item.id}>
                      <Task
                        key={item.id}
                        title={item.title}
                        status={item.status}
                        onToggle={() => handleToggle(item.id)}
                        onDelete={() => handleDelete(item.id)}
                        onEdit={(newTitle) => handleEdit(item.id, newTitle)}
                      />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;