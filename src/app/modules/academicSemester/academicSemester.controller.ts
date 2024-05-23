import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IAcademicSemester } from './academicSemester.interface';
import { AcademicSemesterService } from './academicSemester.service';

const createAcademicSemester = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { ...academicSemesterData } = req.body;
        const result =
            await AcademicSemesterService.createAcademicSemester(
                academicSemesterData,
            );

        sendResponse<IAcademicSemester>(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: 'Academic Semester created successfully!',
            data: result,
        });
        next();
    },
);

export const AcademicSemesterController = {
    createAcademicSemester,
};
