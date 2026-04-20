import { useState } from "react";
import type { Task, AlertType } from "../App";

type TaskCardProps = {
  task: Task;
  onEditTask: (id: number, newText: string) => void;
  onToggleCompleted: (id: number) => void;
  onShowAlert: (message: string, type?: AlertType) => void;
  onAskDelete: (id: number) => void;
};

function TaskCard({
  task,
  onEditTask,
  onToggleCompleted,
  onShowAlert,
  onAskDelete,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);

  const handleSave = () => {
    const cleanText = editedText.trim();

    if (!cleanText) {
      onShowAlert("Task text cannot be empty.", "error");
      return;
    }

    onEditTask(task.id, cleanText);
    setIsEditing(false);
    onShowAlert("Task updated successfully.", "success");
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  return (
    <li className={`task-card ${task.completed ? "completed" : ""}`}>
      {isEditing ? (
        <input
          className="edit-input"
          type="text"
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
          }}
        />
      ) : (
        <span className="task-text">{task.text}</span>
      )}

      <div className="task-actions">
        {isEditing ? (
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
        ) : (
          <button className="edit-btn" onClick={handleStartEdit}>
            Edit
          </button>
        )}

        <button className="complete-btn" onClick={() => onToggleCompleted(task.id)}>
          {task.completed ? "Undo" : "Complete"}
        </button>

        <button className="delete-btn" onClick={() => onAskDelete(task.id)}>
          Delete
        </button>
      </div>
    </li>
  );
}

export default TaskCard;




