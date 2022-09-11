import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import { userService } from '../services/UserService';
import { ApiError } from '../exceptions/ApiErrors';

dotenv.config();

class UserController {
    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest("Invalid data input", errors.array()));
            }

            const { email, password, repeatPass } = req.body; 

            const user = await userService.registration(email, password, repeatPass);
            
            res.status(200).json({user});
        } catch(err) {
            next(err);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest("Invalid data format", errors.array()));
            }

            const { email, password } = req.body;

            const loginInfo = await userService.login(email, password);
            
            res.cookie('refreshToken', loginInfo.refreshToken, {
                expires: new Date(Date.now() + (3600 * 1000 * 24 * 180 * 1)), //second min hour days year
                httpOnly: true, // backend only
                sameSite: 'lax'
            });

            res.status(200).json({loginInfo});
        } catch(err) {
            next(err);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            
        } catch(err) {
            next(err);
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.cookies;
            const key = process.env.JWT_REFRESH_KEY || "";

            const tokens = await userService.refresh(refreshToken, key);

            res.cookie('refreshToken', tokens.refreshToken, {
                expires: new Date(Date.now() + (3600 * 1000 * 24 * 180 * 1)), 
                httpOnly: true,
                sameSite: 'lax'
            });
            
            res.status(200).json({accessToken: tokens.accessToken});
        } catch(err) {
            next(err);
        }
    }
}

export const userController = new UserController();