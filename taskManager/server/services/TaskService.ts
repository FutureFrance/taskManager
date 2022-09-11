import { ObjectId } from "mongodb";
import { ApiError } from '../exceptions/ApiErrors';
import TaskModel from '../models/TaskModel'

class TaskService {
    async createTask(taskContent: string = "", ownerId: string = "") {
        const task = await TaskModel.create({
            owner: ownerId,
            taskContent: taskContent
        });
        return task;
    }

    async modifyTask(newTaskContent: string = "", isCompleted: boolean = false, owner: string = "", taskId: ObjectId) {
        const task = await TaskModel.findOne({_id: taskId});

        if (!task) {
            throw ApiError.badRequest("No task find");
        }

        if (String(task.owner) !== owner) {
            throw ApiError.badRequest("User does not have permission to modify the task");
        }

        const modifiedTask = await TaskModel.findOneAndUpdate({_id: taskId}, {
            taskContent: newTaskContent,
            isCompleted
        }, ({new: true}));

        if (modifiedTask) {
            return modifiedTask;
        }

        throw ApiError.badRequest("Task was not found or updated");
    }

    async deleteTask(taskId: ObjectId, ownerId: string = "") {
        const task = await TaskModel.findOne({_id: taskId});

        if (!task) {
            throw ApiError.badRequest("Could not find a task with this taskId");
        }

        if (String(task.owner) !== ownerId) {
            throw ApiError.badRequest("User does not have permission to delete this task");
        }

        const taskToDelete = await TaskModel.findOneAndDelete({_id: taskId})

        return taskToDelete;
    }

    async getTasks(ownerId: ObjectId) {
        const tasks = await TaskModel.find({owner: ownerId});

        return tasks;
    }
}

export const taskService = new TaskService();