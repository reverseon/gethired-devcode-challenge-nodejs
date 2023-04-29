import db from "./db";

const migrate = async () => {
    try {
        await db.query(`
            DROP TABLE IF EXISTS activities
        `);
        await db.query(`
            DROP TABLE IF EXISTS todos
        `);
        await db.query(`
            CREATE TABLE IF NOT EXISTS activities (
                activity_id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                email VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        await db.query(`
            CREATE TABLE IF NOT EXISTS todos (
                todo_id INT AUTO_INCREMENT PRIMARY KEY,
                activity_group_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                is_active BOOLEAN NOT NULL DEFAULT true,
                priority VARCHAR(255) NOT NULL DEFAULT 'very-high',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log("Migration success")
    } catch (e) {
        console.log("Migration failed")
    }
}

export default migrate;