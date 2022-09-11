import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Tokens, tokenData } from '../interfaces/TokenInterfaces';
import TokenModel from '../models/TokenModel';
import { ApiError } from '../exceptions/ApiErrors';

dotenv.config()

export class TokenService {
    async generateTokens(payload: Object): Promise<Tokens> {
        const accessKey = process.env.JWT_ACCESS_KEY || "";
        const refreshKey = process.env.JWT_REFRESH_KEY || "";

        const accessToken = jwt.sign(payload, accessKey, {expiresIn: "30m"});
        const refreshToken = jwt.sign(payload, refreshKey, {expiresIn: "30d"});

        return ({
            refreshToken,
            accessToken
        } as Tokens);
    }

    async validateToken(token: string, key: string) {
        try {
            const valid = jwt.verify(token, key);

            return (valid as tokenData);
        } catch(err) {
            throw ApiError.unauthorized();
        }
    }

    async saveToken(userId: Object, refreshToken: string): Promise<Object> {
        const tokenData = await TokenModel.findOne({ userId });

        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }

        const token = await TokenModel.create({
            user: userId,
            refreshToken: refreshToken
        });
    
        return token;
    }
    
    async findToken(refreshToken: string) {
        const token = await TokenModel.findOne({ refreshToken });

        return token;
    }
}

export const tokenService = new TokenService();