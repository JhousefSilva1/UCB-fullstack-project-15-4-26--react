import TaskCard from "./TaskCard";
import EmptyState from "./EmptyState";
import type { Task, AlertType } from "../App";

type TaskListProps = {
  tasks: Task[];
  onEditTask: (id: number, newText: string) => void;
  onToggleCompleted: (id: number) => void;
  onShowAlert: (message: string, type?: AlertType) => void;
  onAskDelete: (id: number) => void;
};

function TaskList({
  tasks,
  onEditTask,
  onToggleCompleted,
  onShowAlert,
  onAskDelete,
}: TaskListProps) {
  if (tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEditTask={onEditTask}
          onToggleCompleted={onToggleCompleted}
          onShowAlert={onShowAlert}
          onAskDelete={onAskDelete}
        />
      ))}
    </ul>
  );
}

export default TaskList;






