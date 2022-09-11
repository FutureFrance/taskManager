import bcrypt from 'bcrypt';
import UserModel from '../models/UserModel';
import { tokenService } from '../services/TokenService';
import { ApiError } from '../exceptions/ApiErrors';
import { Tokens } from '../interfaces/TokenInterfaces';

class UserService {
    async registration(email: string, password: string, repeatPass: string): Promise<Object> {
        const candidate = await UserModel.findOne({ email });

        if (candidate) {
            throw ApiError.badRequest("User with this email has already been registered");
        }
 
        if (password !== repeatPass) {
            throw ApiError.badRequest("Passwords do not match");
        }

        const passwordHash = await bcrypt.hash(password, 3);

        const user = await UserModel.create({
            email,
            password: passwordHash
        });

        return user;
    }

    async login(email: string, password: string): Promise<Tokens> {
        const user = await UserModel.findOne({ email });

        if (!user) {
            throw ApiError.badRequest("Invalid email or password");
        }

        const equalPass = await bcrypt.compare(password, user.password);

        if (!equalPass) {
            throw ApiError.badRequest("Invalid email or password");
        }

        const userDto = {
            userId: user._id,
        }

        const tokens = await tokenService.generateTokens(userDto);
        await tokenService.saveToken(user._id, tokens.refreshToken);

        return {...tokens}
    }

    async refresh(refreshToken: string, key: string) {
        try {
            //console.log(`Refresh token:  ${refreshToken}`)
            const valid = await tokenService.validateToken(refreshToken, key);
            const findFromDB = await tokenService.findToken(refreshToken);
            //console.log(`valid: ${valid}\n findFromDB: ${findFromDB}`)
            if (!valid || !findFromDB) {
                throw ApiError.unauthorized();
            } 

            const user = await UserModel.findOne({ userId: valid.userId });
            
            if (!user) {
                throw ApiError.badRequest("User doesn't exist");
            }

            const userDto = {
                userId: valid.userId
            }

            const tokens = await tokenService.generateTokens(userDto);
            await tokenService.saveToken(valid.userId, tokens.refreshToken);

            return {...tokens}
        } catch(err) {
            throw ApiError.unauthorized();
        }
    }
}

export const userService = new UserService();