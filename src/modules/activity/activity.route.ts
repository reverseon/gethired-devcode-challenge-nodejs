import {FastifyInstance} from "fastify";
import {
    createActivityHandler, deleteActivityHandler,
    getActivitiesHandler,
    getActivityHandler,
    updateActivityHandler
} from "./activity.controller";

async function activityRoutes(server: FastifyInstance) {
    server.get("/", getActivitiesHandler);
    server.get("/:id", getActivityHandler);
    server.post("/", createActivityHandler);
    server.patch("/:id", updateActivityHandler);
    server.delete("/:id", deleteActivityHandler);
}
export default activityRoutes;