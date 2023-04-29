import db from "../../utils/db";
import { ResultSetHeader } from "mysql2";

export async function createTodo(
    activity_group_id: number,
    title: string,
    priority?: string,
    is_active?: boolean
) {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        const [rsh] = await conn.query(
            `
            INSERT INTO todos (activity_group_id, title ${priority ? ",priority" : ""}${is_active && priority ? "," : ""}${is_active ? "is_active" : ""})
            VALUES (?, ? ${priority ? `,"${priority}"` : ""}${is_active && priority ? "," : ""}${is_active ? `"${is_active}"` : ""})
        `,
            [activity_group_id, title]
        );
        await conn.commit();
        const [todo] = await conn.query(`
            SELECT *
            FROM todos
            WHERE todo_id = ?
        `, [(rsh as ResultSetHeader).insertId]);
        return { todo: (todo as any)[0] };
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}

export async function getTodos() {
    try {
        const [todos] = await db.query(`
            SELECT *
            FROM todos
        `);
        return { todos };
    } catch (error) {
        throw error;
    }
}

export async function getTodosByActivityId(activity_id: number) {
    try {
        const [todos] = await db.query(`
            SELECT *
            FROM todos
            WHERE activity_group_id = ?
        `, [activity_id]);
        return { todos };
    } catch (error) {
        throw error;
    }
}

export async function getTodoById(todo_id: number) {
    try {
        const [todo] = await db.query(`
            SELECT *
            FROM todos
            WHERE todo_id = ?
        `, [todo_id]);
        return { todo: (todo as any)[0] };
    } catch (error) {
        throw error;
    }
}

export async function updateTodoById(
    todo_id: number,
    title?: string,
    priority?: string,
    is_active?: boolean
) {
    const conn = await db.getConnection();
    try {
        if (title !== undefined || priority !== undefined || is_active !== undefined) {
            await conn.beginTransaction();
            await conn.query(
                `
                UPDATE todos
                SET ${title ? `title = "${title}"` : ''}${title && (priority || is_active) ? ',' : ''}
                    ${priority ? `priority = "${priority}"` : ''}${priority && is_active ? ',' : ''}
                    ${is_active ? `is_active = "${is_active}"` : ''}
                WHERE todo_id = ?
            `,
                [todo_id]
            );
            await conn.commit();
        }
        const [todo] = await conn.query(`
            SELECT *
            FROM todos
            WHERE todo_id = ?
        `, [todo_id]);
        return { todo: (todo as any)[0] };
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}

export async function deleteTodoById(todo_id: number) {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        const [info] = await conn.query(
            `
            SELECT *
            FROM todos
            WHERE todo_id = ?
        `,
            [todo_id]
        );
        const [rhs] = await conn.query(
            `
            DELETE FROM todos
            WHERE todo_id = ?
        `,
            [todo_id]
        );
        await conn.commit();
        return {"ok": (rhs as ResultSetHeader).affectedRows === 1};
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}