import { Request, Response, NextFunction } from 'express';
import { IncomingHttpHeaders } from 'http';
import { ObjectId } from 'mongodb';
import { validationResult } from 'express-validator';
import { ApiError } from '../exceptions/ApiErrors';
import { taskService } from '../services/TaskService';

interface ISpot {
    taskContent?: string,
    isCompleted?: boolean,
    taskId?: string
}

interface CustomHeaders {
    ownerId?: string
}

interface IReqCustom<TBody, THeader> extends Request {
    body: TBody,
    headers: IncomingHttpHeaders & THeader
}

class TaskControllers {
    async createTask(req: IReqCustom<ISpot, CustomHeaders>, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw next(ApiError.badRequest(`${errors.array()}`));
            }

            const { ownerId } = req.headers;
            const { taskContent } = req.body;

            const task = await taskService.createTask(taskContent, ownerId);

            res.status(200).json({task});
        } catch(err) {
            next(err);
        }
    }

    async modifyTask(req: IReqCustom<ISpot, CustomHeaders>, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw ApiError.badRequest(`${errors.array()}`);
            }

            const { ownerId } = req.headers;
            const { taskContent, isCompleted, taskId } = req.body;
            const taskID = new ObjectId(taskId);

            const modifiedTask = await taskService.modifyTask(taskContent, isCompleted, ownerId, taskID);

            res.status(200).json({modifiedTask});
        } catch(err) {
            next(err);
        }
    }

    async deleteTask(req: IReqCustom<ISpot, CustomHeaders>, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw ApiError.badRequest(`${errors.array()}`);
            }

            const { taskId } = req.body;
            const { ownerId } = req.headers;
            const taskID = new ObjectId(taskId);

            const deletedTask = await taskService.deleteTask(taskID, ownerId);

            res.status(200).json({deletedTask});
        } catch(err) {
            next(err);
        }
    }

    async getTasks(req: IReqCustom<ISpot, CustomHeaders>, res: Response, next: NextFunction) {
        try {
            const { ownerId } = req.headers;
            const ownerID = new ObjectId(ownerId);
            const tasks = await taskService.getTasks(ownerID);

            res.status(500).json({tasks}); 
        } catch(err) {
            next(err);
        }
    }
}

export const taskController = new TaskControllers();