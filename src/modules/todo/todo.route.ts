import {FastifyInstance} from "fastify";
import {
    createTodoHandler, deleteTodoHandler,
    getTodosHandler,
    getTodoHandler,
    updateTodoHandler
} from "./todo.controller";

async function todoRoutes(server: FastifyInstance) {
    server.get("/", getTodosHandler);
    server.get("/:id", getTodoHandler);
    server.post("/", createTodoHandler);
    server.patch("/:id", updateTodoHandler);
    server.delete("/:id", deleteTodoHandler);
}

export default todoRoutes;