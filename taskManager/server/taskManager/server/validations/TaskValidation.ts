import { isBoolean } from 'class-validator';
import { body } from 'express-validator';

export const createTask = [
    body("taskContent", "The task content is too short").isLength({min:1}),
];

export const modifyTask = [
    body("taskContent", "The task content is too short").isLength({min:1}),
    body("isCompleted", "The isCompleted field is not boolean").isBoolean(),
    body("taskId", "No taskId field provided").isLength({min:1})
];

export const deleteTask = [
    body("taskId", "The task content is too short").isLength({min:1}),
]
