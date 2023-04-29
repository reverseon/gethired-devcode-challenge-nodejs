import db from "../../utils/db";
import {ResultSetHeader} from "mysql2";

export async function createActivity(title: string, email?: string) {
    // using mysql2 pool
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        const [rsh] = await conn.query(
            `
            INSERT INTO activities (title, email)
            VALUES (?, ?)
        `,
            [title, email]
        );
        await conn.commit();
        const [activity] = await conn.query(`
            SELECT *
            FROM activities
            WHERE activity_id = ?
        `, [(rsh as ResultSetHeader).insertId]);
        return { activity: (activity as any)[0] };
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}

export async function getActivities() {
    try {
        const [activities] = await db.query(`
            SELECT *
            FROM activities
        `);
        return {activities};
    } catch (error) {
        throw error;
    }
}

export async function getActivity(activityId: number) {
    try {
        const [activity] = await db.query(`
            SELECT *
            FROM activities
            WHERE activity_id = ?
        `, [activityId]);
        return {activity: (activity as any)[0]};
    } catch (error) {
        throw error;
    }
}

export async function updateActivity(activityId: number, title?: string, email?: string) {
    const conn = await db.getConnection();
    try {
        if (title !== undefined || email !== undefined) {
            await conn.beginTransaction();
            await conn.query(`
                UPDATE activities
                SET ${title?`title = "${title}"`:""}
                    ${title && email?`,`:""}
                    ${email?`email = "${email}"`:""}
                WHERE activity_id = ?
            `, [activityId]
            );
            await conn.commit();
        }
        const [activity] = await conn.query(`
            SELECT *
            FROM activities
            WHERE activity_id = ?
        `, [activityId]);
        return { activity: (activity as any)[0] };
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}

export async function deleteActivity(activityId: number) {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        const [rhs] = await conn.query(
            `
            DELETE FROM activities
            WHERE activity_id = ?
        `,
            [activityId]
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
