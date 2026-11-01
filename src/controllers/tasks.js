import * as taskService from '../services/tasks.js';

export async function getTasks(req, res, next) {
    try {
        const tasks = await taskService.getAllTasks();

        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
}