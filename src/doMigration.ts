import 'dotenv/config';
import migrate from "./utils/migrate";

async function main() {
    await migrate();
    process.exit(0);
}

main();