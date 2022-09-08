import { body } from 'express-validator';

export const createTask = [
    body("content", "The task content is too short").isLength({min:1}),
];