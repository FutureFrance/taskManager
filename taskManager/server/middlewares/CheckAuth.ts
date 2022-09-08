import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { ApiError } from '../exceptions/ApiErrors';
import { tokenService } from '../services/TokenService';

dotenv.config();

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationToken = (req.headers.authorization || '').replace(/Bearer\s?/, '');

        if (!authorizationToken) {
            return next(ApiError.unauthorized());
        }

        const tokenKey = process.env.JWT_ACCESS_KEY || "";

        const tokenData = await tokenService.validateToken(authorizationToken, tokenKey);

        tokenData.userId = req.body;
        next();
    } catch(err) {
        next(ApiError.unauthorized());
    }
}