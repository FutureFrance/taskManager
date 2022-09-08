import { ObjectId } from "mongodb";
import { ApiError } from '../exceptions/ApiErrors';
import TaskModel from '../models/TaskModel'

class TaskService {
    async createTask(taskContent: string, ownerId: ObjectId) {
        try {
            console.log(`${ownerId}:::${typeof(ownerId)}`);

            const task = await TaskModel.create({
                owner: ownerId,
                content: taskContent
            });
            console.log(`${task}\n${task.owner}:::${typeof(task.owner)}` )
            return task;
        } catch(err) {
            throw ApiError.badRequest("Unable to create this task");
        }
    }

    async modifyTask(newTaskContent: string, isCompleted: boolean, owner: ObjectId, taskId: ObjectId) {
        const task = await TaskModel.findOne({_id: taskId});

        if (!task) {
            throw ApiError.badRequest("No task find");
        }

        //if (task.owner !== owner) {
            //throw ApiError.badRequest("User does not have permission to modify the task");
       // }

        const modifiedTask = await TaskModel.findOneAndUpdate({_id: taskId}, {
            content: newTaskContent,
            isCompleted
        });

        if (modifiedTask) {
            return modifiedTask;
        }

        throw ApiError.badRequest("Task was not found or updated");
    }

    async deleteTask() {

    }

    async getTasks() {

    }
}

export const taskService = new TaskService();