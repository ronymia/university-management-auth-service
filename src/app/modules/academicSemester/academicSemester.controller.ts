import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IAcademicSemester } from './academicSemester.interface';
import { AcademicSemesterService } from './academicSemester.service';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constant/pagination';
import { academicSemesterFilterableFields } from './academicSemester.constant';

// create semester
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

// get all semesters
const getAllAcademicSemesters = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const filters = pick(req.query, academicSemesterFilterableFields);
        const paginationOptions = pick(req.query, paginationFields);

        const result = await AcademicSemesterService.getAllAcademicSemesters(
            filters,
            paginationOptions,
        );

        sendResponse<IAcademicSemester[]>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Academic Semesters fetched successfully!',
            meta: result.meta,
            data: result.data,
        });
        next();
    },
);

export const AcademicSemesterController = {
    createAcademicSemester,
    getAllAcademicSemesters,
};
