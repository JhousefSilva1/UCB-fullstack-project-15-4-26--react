import { useEffect, useState } from "react";
import Header from "./componentes/Header";
import TaskForm from "./componentes/TaskForm";
import TaskList from "./componentes/TaskList";
import CustomAlert from "./componentes/CustomAlert";
import ConfirmModal from "./componentes/ConfirmModal";
import Footer from "./componentes/Footer";
import "./App.css";

export type AlertType = "success" | "error" | "info";

export type Task = {
  id: number;
  text: string;
  completed: boolean;
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<AlertType>("info");
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [deletedCount, setDeletedCount] = useState(0);

  const API_URL = "http://localhost:3000/tasks";

  const showAlert = (message: string, type: AlertType = "info") => {
    setAlertMessage(message);
    setAlertType(type);
  };

  useEffect(() => {
    if (!alertMessage) return;

    const timer = setTimeout(() => {
      setAlertMessage("");
    }, 2500);

    return () => clearTimeout(timer);
  }, [alertMessage]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();

      const adaptedTasks: Task[] = data.map((task: any) => ({
        id: task.id,
        text: task.title,
        completed: task.completed,
      }));

      setTasks(adaptedTasks);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
      showAlert("No se pudieron cargar las tareas del backend.", "error");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (text: string) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: text,
          completed: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const newTaskFromBackend = await response.json();

      const adaptedTask: Task = {
        id: newTaskFromBackend.id,
        text: newTaskFromBackend.title,
        completed: newTaskFromBackend.completed,
      };

      setTasks((prev) => [...prev, adaptedTask]);
      showAlert("Tarea agregada exitosamente.", "success");
    } catch (error) {
      console.error("Error al agregar tarea:", error);
      showAlert("No se pudo agregar la tarea.", "error");
    }
  };

  const editTask = async (id: number, newText: string) => {
    const currentTask = tasks.find((task) => task.id === id);

    if (!currentTask) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newText,
          completed: currentTask.completed,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const updatedTaskFromBackend = await response.json();

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                id: updatedTaskFromBackend.id,
                text: updatedTaskFromBackend.title,
                completed: updatedTaskFromBackend.completed,
              }
            : task
        )
      );

      showAlert("Tarea actualizada correctamente.", "success");
    } catch (error) {
      console.error("Error al editar tarea:", error);
      showAlert("No se pudo actualizar la tarea.", "error");
    }
  };

  const toggleTaskCompleted = async (id: number) => {
    const currentTask = tasks.find((task) => task.id === id);

    if (!currentTask) return;

    try {
      const response = await fetch(`${API_URL}/${id}/toggle`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to toggle task");
      }

      const updatedTaskFromBackend = await response.json();

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                id: updatedTaskFromBackend.id,
                text: updatedTaskFromBackend.title,
                completed: updatedTaskFromBackend.completed,
              }
            : task
        )
      );

      if (updatedTaskFromBackend.completed) {
        showAlert("Tarea marcada como completada.", "success");
      } else {
        showAlert("Tarea marcada como incompleta.", "info");
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      showAlert("No se pudo cambiar el estado de la tarea.", "error");
    }
  };

  const askDeleteTask = (id: number) => {
    setTaskToDelete(id);
  };
  const confirmDeleteTask = async () => {
    if (taskToDelete === null) return;
    try {
      const response = await fetch(`${API_URL}/${taskToDelete}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      setTasks((prev) => prev.filter((task) => task.id !== taskToDelete));
      setDeletedCount((prev) => prev + 1);
      setTaskToDelete(null);
      showAlert("Tarea eliminada.", "success");
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
      showAlert("No se pudo eliminar la tarea.", "error");
    }
  };
  const cancelDeleteTask = () => {
    setTaskToDelete(null);
    showAlert("Eliminación cancelada.", "info");
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="app-page">
      <div className="app-container">
        <Header />

        {alertMessage && (
          <CustomAlert message={alertMessage} type={alertType} />
        )}

        <TaskForm onAddTask={addTask} onShowAlert={showAlert} />

        <TaskList
          tasks={tasks}
          onEditTask={editTask}
          onToggleCompleted={toggleTaskCompleted}
          onShowAlert={showAlert}
          onAskDelete={askDeleteTask}
        />

        <Footer
          total={totalTasks}
          completed={completedTasks}
          pending={pendingTasks}
          deleted={deletedCount}
        />
      </div>

      <ConfirmModal
        isOpen={taskToDelete !== null}
        title="Eliminar Tarea"
        message="¿Estás seguro de que quieres eliminar esta tarea?"
        onConfirm={confirmDeleteTask}
        onCancel={cancelDeleteTask}
      />
    </div>
  );
}

export default App;