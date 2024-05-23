import { NextFunction, Request, RequestHandler, Response } from 'express';
import { UserService } from './user.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IUser } from './user.interface';
import httpStatus from 'http-status-codes';

const createUser: RequestHandler = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { user } = req.body;
        const result = await UserService.createUserService(user);

        sendResponse<IUser>(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: 'user created successfully!',
            data: result,
        });
        next();
    },
);

export const UserController = {
    createUser,
};
