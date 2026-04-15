import express from "express";
import type { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

let tasks: Task[] = [
  { id: 1, title: "Study Express", completed: false },
  { id: 2, title: "Build backend", completed: true },
];

app.get("/", (req: Request, res: Response) => {
  res.send("Backend is working!");
});

app.get("/tasks", (req: Request, res: Response) => {
  res.json(tasks);
});

app.post("/tasks", (req: Request, res: Response) => {
  const { title, completed } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({
      message: "Title is required",
    });
  }

  const newTask: Task = {
    id: Date.now(),
    title: title.trim(),
    completed: completed ?? false,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put("/tasks/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { title, completed } = req.body;

  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  if (!title || title.trim() === "") {
    return res.status(400).json({
      message: "Title is required",
    });
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    title: title.trim(),
    completed: completed ?? tasks[taskIndex].completed,
  };

  res.json(tasks[taskIndex]);
});

app.patch("/tasks/:id/toggle", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  task.completed = !task.completed;

  res.json(task);
});

app.delete("/tasks/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const taskExists = tasks.some((task) => task.id === id);

  if (!taskExists) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  tasks = tasks.filter((task) => task.id !== id);

  res.json({
    message: "Task deleted successfully",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});