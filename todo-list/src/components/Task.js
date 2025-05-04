import React, { useState } from "react";
import "./Task.css";
// All the info needed to create the task card
// title, status are on display
// Toggle is to check or uncheck the complete box
// onDelete and onEdit handle the server calls that need to be made in eithe case
const Task = ({ title, status, onToggle, onDelete, onEdit }) => {
    // Toggle the checbox
    const isCompleted = status === "completed";
    // Change appearance based on if it is currently being edited 
    const [isEditing, setIsEditing] = useState(false);
    // store the edited version of the title 
    const [editedTitle, setEditedTitle] = useState(title);
    // Handles the edit functionality
    const handleEditConfirm = () => {
        // check if the trimmed title is not empty as well as different from the originl title 
        if (editedTitle.trim() && editedTitle !== title) {
            onEdit(editedTitle.trim());
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        // Esc key will undo/leave it as is and enter key will confirm the changes
        if (e.key === "Enter") handleEditConfirm();
        else if (e.key === "Escape") {
            setEditedTitle(title);
            setIsEditing(false);
        }
    };

    return (
        <div className="task">
        <div className="task-left">
            <input
            type="checkbox"
            // Based on value pased in for completion
            checked={isCompleted}
            // Call function declared in app.js
            onChange={onToggle}
            />
            {/* Input field to edit will be shown based on if edit buttons is pressed */}
            {isEditing ? (
            <input
                type="text"
                className="edit-input"
                value={editedTitle}
                // 
                onChange={(e) => setEditedTitle(e.target.value)}
                // If either we leave the field or we press a key the same event is essentially triggered 
                onBlur={handleEditConfirm}
                onKeyDown={handleKeyDown}
                autoFocus
            />
            ) : (
            <span
                // If its completed it strikes through the text which is a nice feature 
                className={`task-title ${isCompleted ? "completed" : ""}`}
                onDoubleClick={() => setIsEditing(true)}
            >
                {title}
            </span>
            )}
        </div>
        {/* Edit and delete buttons */}
        <div className="task-actions">
            {!isEditing && (
            <button className="edit-button" onClick={() => setIsEditing(true)}>
                Edit
            </button>
            )}
            <button className="delete-button" onClick={onDelete}>
            Delete
            </button>
        </div>
        </div>
    );
};

export default Task;
