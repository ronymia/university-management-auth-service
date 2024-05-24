import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { academicSemesterTitleCodeMapper } from './academicSemester.constant';
import { IAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';
import httpStatus from 'http-status-codes';

const createAcademicSemester = async (
    payload: IAcademicSemester,
): Promise<IAcademicSemester | null> => {
    if (academicSemesterTitleCodeMapper[payload.title] !== payload.code) {
        throw new ApiError(
            httpStatus.UNPROCESSABLE_ENTITY,
            'Invalid academic semester code',
        );
    }
    const result = await AcademicSemester.create(payload);
    return result;
};

const getAllAcademicSemesters = async (
    paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IAcademicSemester[]>> => {
    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelper.calculatePagination(paginationOptions);

    const finalSortOrder: { [keyof: string]: SortOrder } = {};

    if (sortBy && sortOrder) {
        finalSortOrder[sortBy] = sortOrder;
    }
    const result = await AcademicSemester.find()
        .sort(finalSortOrder)
        .skip(skip)
        .limit(limit);

    //
    const total = await AcademicSemester.countDocuments();

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};

export const AcademicSemesterService = {
    createAcademicSemester,
    getAllAcademicSemesters,
};
