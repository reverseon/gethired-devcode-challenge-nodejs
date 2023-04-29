import {FastifyReply, FastifyRequest} from "fastify";
import {
    getActivities,
    getActivity,
    createActivity,
    updateActivity,
    deleteActivity
} from "./activity.service";
import {
    CustomMessage,
    FailedMessage,
    FormattingActivity,
    NotFoundMessage,
    SuccessMessage
} from "../../model/template.payload";

export async function getActivitiesHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
        const activities: any = (await getActivities()).activities;
        if (activities.length === 0) {
            reply.status(404).send(
                NotFoundMessage('Activity Not Found')
            );
        } else {
            reply.send(
                SuccessMessage('Success', activities.map((activity: any) => {
                    return FormattingActivity(activity)
                }))
            )
        }
    } catch (e) {
        reply.status(500).send(FailedMessage('Something went wrong'));
        console.log(e);
    }
}

export async function getActivityHandler(request: FastifyRequest<{
    Params: {
        id: string
    }
}>, reply: FastifyReply) {
    try {
        const activity: any = (await getActivity(Number(request.params.id))).activity;
        if (!activity) {
            reply.status(404).send(
                NotFoundMessage(`Activity with ID ${request.params.id} Not Found`)
            );
        } else {
            reply.send(SuccessMessage('Success', FormattingActivity(activity)))
        }
    } catch (e) {
        reply.status(500).send({
            status: 'Failed',
            message: 'Something went wrong'
        });
        console.log(e);
    }
}

export async function createActivityHandler(request: FastifyRequest<{
    Body?: {
        title?: string,
        email?: string
    }
}>, reply: FastifyReply) {
    try {
        if (!request.body?.title) {
            reply.status(400).send(
                CustomMessage("Bad Request", 'title cannot be null')
            );
            return;
        }
        const activity = (await createActivity(request.body.title, request.body.email)).activity;
        reply.status(201).send(SuccessMessage('Success', FormattingActivity(activity)))
    } catch (e) {
        reply.status(500).send(
            FailedMessage('Something went wrong')
        );
        console.log(e);
    }
}

export async function updateActivityHandler(request: FastifyRequest<{
    Params: {
        id: string
    },
    Body?: {
        title?: string,
        email?: string
    }
}>, reply: FastifyReply) {
    try {
        const activity = (await updateActivity(Number(request.params.id), request.body?.title, request.body?.email)).activity;
        if (activity) {
            reply.send(
                SuccessMessage('Success', FormattingActivity(activity))
            )
        } else {
            reply.status(404).send(
                NotFoundMessage(`Activity with ID ${request.params.id} Not Found`)
            );
        }
    } catch (e) {
        reply.status(500).send(
            FailedMessage('Something went wrong')
        );
        console.log(e);
    }
}

export async function deleteActivityHandler(request: FastifyRequest<{
    Params: {
        id: string
    }
}>, reply: FastifyReply) {
    try {
        const activity = (await deleteActivity(Number(request.params.id))).ok;
        if (activity) {
            reply.send(
                SuccessMessage('Success', {})
            )
        } else {
            reply.status(404).send(
                NotFoundMessage(`Activity with ID ${request.params.id} Not Found`)
            );
        }
    } catch (e) {
        reply.status(500).send(FailedMessage('Something went wrong'));
        console.log(e);
    }
}