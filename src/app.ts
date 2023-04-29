import 'dotenv/config'
import Fastify from 'fastify';
import activityRoutes from "./modules/activity/activity.route";
import todoRoutes from "./modules/todo/todo.route";
import {AddressInfo} from "net";

const app = Fastify();

async function main() {
    app.register(activityRoutes, {prefix: '/activity-groups'});
    app.register(todoRoutes, {prefix: '/todo-items'});
    try {
        await app.listen({
            port: 3030,
            host: '0.0.0.0'
        });
        const addrInfo = app.server.address() as AddressInfo;
        console.log(`Server is running on ${addrInfo.address}:${addrInfo.port}`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

main();