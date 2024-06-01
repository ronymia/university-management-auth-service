import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status-codes';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constant/pagination';
import { IAcademicDepartment } from './academicDepartment.interface';
import { AcademicDepartmentService } from './academicDepartment.service';
import { academicDepartmentFilterableFields } from './academicDepartment.constant';

// create faculty
const createAcademicDepartment = catchAsync(
    async (req: Request, res: Response) => {
        const { ...academicDepartmentData } = req.body;
        const result = await AcademicDepartmentService.createAcademicDepartment(
            academicDepartmentData,
        );

        sendResponse<IAcademicDepartment>(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: 'Academic Department created successfully!',
            data: result,
        });
    },
);

// get single Department
const getSingleAcademicDepartment = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result =
            await AcademicDepartmentService.getSingleAcademicDepartment(id);

        sendResponse<IAcademicDepartment>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Academic Department fetched successfully!',
            data: result,
        });
    },
);

// get all Department
const getAllAcademicDepartment = catchAsync(
    async (req: Request, res: Response) => {
        const filters = pick(req.query, academicDepartmentFilterableFields);
        const paginationOptions = pick(req.query, paginationFields);

        const result = await AcademicDepartmentService.getAllAcademicDepartment(
            filters,
            paginationOptions,
        );

        sendResponse<IAcademicDepartment[]>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Academic Department fetched successfully!',
            meta: result.meta,
            data: result.data,
        });
    },
);

// update single Department
const updateAcademicDepartment = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await AcademicDepartmentService.updateAcademicDepartment(
            id,
            req.body,
        );

        sendResponse<IAcademicDepartment>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Academic Department updated successfully!',
            data: result,
        });
    },
);

// delete single Department
const deleteAcademicDepartment = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result =
            await AcademicDepartmentService.deleteAcademicDepartment(id);

        sendResponse<IAcademicDepartment>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Academic Department Deleted successfully!',
            data: result,
        });
    },
);

export const AcademicDepartmentController = {
    createAcademicDepartment,
    getSingleAcademicDepartment,
    getAllAcademicDepartment,
    updateAcademicDepartment,
    deleteAcademicDepartment,
};
