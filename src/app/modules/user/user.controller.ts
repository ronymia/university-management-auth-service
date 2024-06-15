import { Request, RequestHandler, Response } from 'express';
import { UserService } from './user.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IUser } from './user.interface';
import httpStatus from 'http-status-codes';

const createStudent: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const { student, ...userData } = req.body;
        const result = await UserService.createStudent(student, userData);

        sendResponse<IUser>(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: 'Student created successfully!',
            data: result,
        });
    },
);

export const UserController = {
    createStudent,
};
