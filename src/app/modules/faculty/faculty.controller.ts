import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constant/pagination';
import { FacultyService } from './faculty.service';
import { facultyFilterableFields } from './faculty.constant';
import { IFaculty } from './faculty.interface';

// SINGLE FACULTY
const getSingleFaculty = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await FacultyService.getSingleFaculty(id);

    sendResponse<IFaculty>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculty fetched successfully!',
        data: result,
    });
});

// ALL FACULTY
const getAllFaculty = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, facultyFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await FacultyService.getAllFaculty(
        filters,
        paginationOptions,
    );

    sendResponse<IFaculty[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All Faculty fetched successfully!',
        meta: result.meta,
        data: result.data,
    });
});

// UPDATE FACULTY
const updateFaculty = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await FacultyService.updateFaculty(id, req.body);

    sendResponse<IFaculty>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculty updated successfully!',
        data: result,
    });
});

// DELETE FACULTY
const deleteFaculty = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await FacultyService.deleteFaculty(id);

    sendResponse<IFaculty>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculty Deleted successfully!',
        data: result,
    });
});

export const FacultyController = {
    getAllFaculty,
    getSingleFaculty,
    updateFaculty,
    deleteFaculty,
};
