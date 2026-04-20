"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const SECRET_KEY = process.env.JWT_SECRET || "mi_clave_secreta";
const app = (0, express_1.default)();
const PORT = 3000;
const adapter = new adapter_pg_1.PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
const prisma = new client_1.PrismaClient({ adapter });
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
}));
app.use(express_1.default.json());
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "123456") {
        const token = jsonwebtoken_1.default.sign({ username: username }, SECRET_KEY, { expiresIn: "1h" });
        return res.json({
            message: "Login successful",
            token,
        });
    }
    return res.status(401).json({
        message: "Invalid credentials",
    });
});
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            message: "Token required",
        });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            message: "Invalid token format",
        });
    }
    try {
        jsonwebtoken_1.default.verify(token, SECRET_KEY);
        next();
    }
    catch (error) {
        return res.status(403).json({
            message: "Invalid or expired token",
        });
    }
};
app.get("/", (_req, res) => {
    res.send("Backend is working!");
});
app.get("/private", verifyToken, (_req, res) => {
    res.json({
        message: "Acceso permitido",
    });
});
app.get("/tasks", async (_req, res) => {
    try {
        const tasks = await prisma.task.findMany({
            orderBy: {
                id: "asc",
            },
        });
        res.json(tasks);
    }
    catch (error) {
        console.error("Error getting tasks:", error);
        res.status(500).json({
            message: "Failed to fetch tasks",
        });
    }
});
app.post("/tasks", async (req, res) => {
    try {
        const { title, completed } = req.body;
        if (!title || title.trim() === "") {
            return res.status(400).json({
                message: "Title is required",
            });
        }
        const newTask = await prisma.task.create({
            data: {
                title: title.trim(),
                completed: completed ?? false,
            },
        });
        res.status(201).json(newTask);
    }
    catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({
            message: "Failed to create task",
        });
    }
});
app.put("/tasks/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { title, completed } = req.body;
        if (!title || title.trim() === "") {
            return res.status(400).json({
                message: "Title is required",
            });
        }
        const existingTask = await prisma.task.findUnique({
            where: { id },
        });
        if (!existingTask) {
            return res.status(404).json({
                message: "Task not found",
            });
        }
        const updatedTask = await prisma.task.update({
            where: { id },
            data: {
                title: title.trim(),
                completed: completed ?? existingTask.completed,
            },
        });
        res.json(updatedTask);
    }
    catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({
            message: "Failed to update task",
        });
    }
});
app.patch("/tasks/:id/toggle", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const existingTask = await prisma.task.findUnique({
            where: { id },
        });
        if (!existingTask) {
            return res.status(404).json({
                message: "Task not found",
            });
        }
        const updatedTask = await prisma.task.update({
            where: { id },
            data: {
                completed: !existingTask.completed,
            },
        });
        res.json(updatedTask);
    }
    catch (error) {
        console.error("Error toggling task:", error);
        res.status(500).json({
            message: "Failed to toggle task",
        });
    }
});
app.delete("/tasks/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const existingTask = await prisma.task.findUnique({
            where: { id },
        });
        if (!existingTask) {
            return res.status(404).json({
                message: "Task not found",
            });
        }
        await prisma.task.delete({
            where: { id },
        });
        res.json({
            message: "Task deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({
            message: "Failed to delete task",
        });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
