import {FastifyReply, FastifyRequest} from "fastify";
import {
    getTodos,
    getTodoById,
    createTodo,
    updateTodoById,
    deleteTodoById, getTodosByActivityId
} from "./todo.service";

import {
    CustomMessage,
    FailedMessage,
    FormattingTodo,
    NotFoundMessage,
    SuccessMessage
} from "../../model/template.payload";

export async function getTodosHandler(request: FastifyRequest<{
    Querystring: {
        activity_group_id: string
    }
}>, reply: FastifyReply) {
    try {
        let todos: any;
        if (request.query.activity_group_id) {
            todos = (await getTodosByActivityId(Number(request.query.activity_group_id))).todos;
        } else {
            todos = (await getTodos()).todos;
        }
        reply.send(
            SuccessMessage('Success', todos.map((todo: any) => {
                return FormattingTodo(todo)
            }))
        )
    } catch (e) {
        reply.status(500).send(FailedMessage('Something went wrong'));
        console.log(e);
    }
}

export async function getTodoHandler(request: FastifyRequest<{
    Params: {
        id: string
    }
}>, reply: FastifyReply) {
    try {
        const todo: any = (await getTodoById(Number(request.params.id))).todo;
        if (!todo) {
            reply.status(404).send(
                NotFoundMessage(`Todo with ID ${request.params.id} Not Found`)
            );
        } else {
            reply.send(
                SuccessMessage('Success', FormattingTodo(todo))
            )
        }
    } catch (e) {
        reply.status(500).send(FailedMessage('Something went wrong'));
        console.log(e);
    }
}

export async function createTodoHandler(request: FastifyRequest<{
    Body?: {
        activity_group_id?: string,
        title?: string,
        priority?: string,
        is_active?: string
    }
}>, reply: FastifyReply) {
    try {
        if (!request.body?.activity_group_id) {
            reply.status(400).send(CustomMessage("Bad Request", 'activity_group_id cannot be null'));
            return;
        } else if (!request.body.title) {
            reply.status(400).send(CustomMessage("Bad Request", 'title cannot be null'));
            return;
        }
        const todo = (await createTodo(
            Number(request.body.activity_group_id),
            request.body.title,
            request.body.priority,
            Boolean(request.body.is_active)
        )).todo;
        reply.status(201).send(
            SuccessMessage('Success', FormattingTodo(todo))
        )
    } catch (e) {
        reply.status(500).send(FailedMessage('Something went wrong'));
        console.log(e);
    }
}

export async function updateTodoHandler(request: FastifyRequest<{
    Params: {
        id: string
    },
    Body?: {
        title?: string,
        priority?: string,
        is_active?: string
        status?: string
    }
}>, reply: FastifyReply) {
    try {
        const todo = (await updateTodoById(
            Number(request.params.id),
            !request.body?.title ? undefined : request.body?.title,
            !request.body?.priority ? undefined : request.body?.priority,
            request.body?.is_active ? Boolean(request.body?.is_active) : undefined,
        )).todo;
        if (todo) {
            reply.send(
                SuccessMessage('Success', FormattingTodo(todo))
            )
        } else {
            reply.status(404).send(
                NotFoundMessage(`Todo with ID ${request.params.id} Not Found`)
            );
        }
    } catch (e) {
        reply.status(500).send(FailedMessage('Something went wrong'));
        console.log(e);
    }
}

export async function deleteTodoHandler(request: FastifyRequest<{
    Params: {
        id: string
    }
}>, reply: FastifyReply) {
    try {
        const todo = (await deleteTodoById(
            Number(request.params.id)
        )).ok;
        if (todo) {
            reply.send(
                SuccessMessage('Success', {})
            )
        } else {
            reply.status(404).send(
                NotFoundMessage(`Todo with ID ${request.params.id} Not Found`)
            );
        }
    } catch (e) {
        reply.status(500).send(FailedMessage('Something went wrong'));
        console.log(e);
    }
}