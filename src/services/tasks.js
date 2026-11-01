import * as taskModel from '../models/tasks.js';

export async function getAllTasks() {
    return taskModel.findAll();
}

export async function getTaskById(id) {
    const task = await taskModel.findById(id);

    if (!task) {
        throw new Error('Task not found');
    }

    return task;
}