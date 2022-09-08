import { body } from 'express-validator';

export const registration = [
    body("email", "Not a valid email").isEmail(),
    body("password", "Password is too short").isLength({ min:5 }),
    body("repeatPass", "repeatPass is too short").isLength({ min:5 })
];

export const login = [
    body("email", "Not a valid email").isEmail(),
    body("password", "Password is too short").isLength({ min:5 }),
];