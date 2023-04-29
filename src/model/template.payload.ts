const NotFoundMessage = (message: string) => {
    return {
        status: 'Not Found',
        message
    }
}

const SuccessMessage = (message: string, data: any) => {
    return {
        status: 'Success',
        message,
        data
    }
}

const FailedMessage = (message: string) => {
    return {
        status: 'Failed',
        message
    }
}

const CustomMessage = (status?: any, message?: any, data?: any) => {
    return {
        status,
        message,
        data
    }
}

const FormattingActivity = (activity: any) => {
    const o1 = {
        id: activity.activity_id,
        title: activity.title
    }
    const o2 = {
        email: activity.email
    }
    const o3 = {
        createdAt: activity.created_at,
        updatedAt: activity.updated_at
    }
    return Object.assign(o1, activity.email ? o2 : {}, o3);
}


const FormattingTodo = (todo: any) => {
    return {
        id: todo.todo_id,
        activity_group_id: todo.activity_group_id,
        title: todo.title,
        is_active: !!todo.is_active,
        priority: todo.priority,
        createdAt: todo.created_at,
        updatedAt: todo.updated_at,
    }
}

export {
    NotFoundMessage,
    SuccessMessage,
    FailedMessage,
    CustomMessage,
    FormattingActivity,
    FormattingTodo,
}