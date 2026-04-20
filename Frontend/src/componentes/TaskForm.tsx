import { useState } from "react";
import type { AlertType } from "../App";

type TaskFormProps = {
  onAddTask: (taskText: string) => void;
  onShowAlert: (message: string, type?: AlertType) => void;
};

function TaskForm({ onAddTask, onShowAlert }: TaskFormProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    const cleanValue = inputValue.trim();

    if (!cleanValue) {
      onShowAlert("Por favor, ingresa una tarea antes de agregarla.", "error");
      return;
    }

    onAddTask(cleanValue);
    onShowAlert("Tarea agregada exitosamente.", "success");
    setInputValue("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="task-form">
      <input
        type="text"
        className="task-input"
        placeholder="Agregar una nueva tarea..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button className="add-task-btn" onClick={handleSubmit}>
        Add
      </button>
    </div>
  );
}

export default TaskForm;







