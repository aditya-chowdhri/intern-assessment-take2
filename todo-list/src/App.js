import React, { useCallback, useState, useEffect } from "react";
import "./App.css";
import Task from "./components/Task"
import TaskBar from "./components/Taskbar"; 

const App = () => {
    const [items, setItems] = useState([]);
    // Handles the status of tasks that we want to display
    const [taskStatus, setTaskStatus] = useState("all");

    // Handle toggle between complete and pending
    const handleToggle = useCallback((taskId) => {
      fetch(`http://localhost:3000/tasks/togglestatus?taskId=${taskId}`, {
        method: "POST",
      })
        .then((res) => res.json())
        // Updated task returned by post call
        .then((updatedTask) => {
          // Updates the array with new item 
          setItems((prevItems) =>
            prevItems.map((item) =>
              item.id === updatedTask.id ? updatedTask : item
            )
          );
        })
    }, []);
    // Handle deletion of tasks 
    const handleDelete = useCallback((taskId) => {
      fetch(`http://localhost:3000/tasks/deletetask?taskId=${taskId}`, {
        method: "POST",
      })
        .then((res) => res.json())
        // Delete the one task that has been deleted in the db
        .then(() => {
          setItems((prevItems) => prevItems.filter((item) => item.id !== taskId));
        })
    }, []);

    const handleCreate = useCallback((taskTitle) => {
      fetch(`http://localhost:3000/tasks/create?taskTitle=${taskTitle}`, {
        method: "POST",
      })
        .then((res) => res.json())
        // Add the new task to the state variable
        .then((newTask) => {
          setItems((prevItems) => [...prevItems, newTask]);
        });
    }, []);
    
    const handleEdit = useCallback((taskId, newTitle) => {
      fetch(`http://localhost:3000/tasks/updatetitle?taskId=${taskId}&newTitle=${encodeURIComponent(newTitle)}`, {
        method: "POST",
      })
        .then((res) => res.json())
        // Similar to changing status edit the one item which had its title edited
        .then((updatedTask) => {
          setItems((prevItems) =>
            prevItems.map((item) =>
              item.id === updatedTask.id ? updatedTask : item
            )
          );
        });
    }, []);
    
    // 
    useEffect(() => {
      // Initially loads the data and updates it whenever we change filter
      // When pagination is implemented on server-side can also edit the page value
        fetch(`http://localhost:3000/tasks/get?taskstatus=${taskStatus}&page=1`)
            .then((res) => res.json())
            .then((json) => {
                setItems(json);
            });
    }, [taskStatus]); 


    

    return (
        <div className="App">
            <h1>To-Do List</h1>
            {/* Task bar using the task bar component */}
            <TaskBar onCreate={handleCreate} /> 
            <div>
              {/* Filter option which accesses the state variable */}
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
              {/* Display all the tasks using the task component */}
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