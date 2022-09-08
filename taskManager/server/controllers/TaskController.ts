import { Request, Response, NextFunction } from 'express';
import { ObjectId } from "mongodb";
import { validationResult } from 'express-validator';
import { ApiError } from '../exceptions/ApiErrors';
import { taskService } from '../services/TaskService';


class TaskControllers {
    async createTask(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw next(ApiError.badRequest(`${errors.array()}`));
            }

            const id: string = req?.body?.user;

            const ownerId = new ObjectId(id);
            const taskContent = req.body.content;

            const task = await taskService.createTask(taskContent, ownerId);

            res.status(200).json({task});
        } catch(err) {
            next(err);
        }
    }

    async modifyTask() {

    }

    async deleteTask() {

    }

    async getTasks() {
        
    }
}

export const taskController = new TaskControllers();