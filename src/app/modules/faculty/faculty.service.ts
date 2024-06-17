/* eslint-disable @typescript-eslint/no-explicit-any */
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import httpStatus from 'http-status-codes';
import { Faculty } from './faculty.model';
import { IFaculty, IFacultyFilters } from './faculty.interface';
import { facultySearchableFields } from './faculty.constant';

const getSingleFaculty = async (id: string): Promise<IFaculty | null> => {
    const result = await Faculty.findById(id);
    return result;
};

const getAllFaculty = async (
    filters: IFacultyFilters,
    paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IFaculty[]>> => {
    const { searchTerm, ...filtersData } = filters;
    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelper.calculatePagination(paginationOptions);
    // search and filters condition
    const andCondition = [];

    // search condition $or
    if (searchTerm) {
        andCondition.push({
            $or: facultySearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }

    // filters condition $and
    if (Object.keys(filtersData).length) {
        andCondition.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }

    const whereCondition = andCondition.length ? { $and: andCondition } : {};

    const sortCondition: { [keyof: string]: SortOrder } = {};

    if (sortBy && sortOrder) {
        sortCondition[sortBy] = sortOrder;
    }
    const result = await Faculty.find(whereCondition)
        .populate('academicDepartment')
        .populate('academicFaculty')
        .sort(sortCondition)
        .skip(skip)
        .limit(limit);

    //
    const total = await Faculty.countDocuments(whereCondition);

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};

const updateFaculty = async (
    id: string,
    payload: Partial<IFaculty>,
): Promise<IFaculty | null> => {
    //
    const isExist = await Faculty.findOne({ id });
    if (!isExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Faculty not found');
    }

    const { name, ...faculty } = payload;

    //
    // Create a new object to hold the update data
    const studentData: Partial<IFaculty> & Record<string, any> = { ...faculty };

    // Update the nested name fields
    if (name && Object.keys(name).length > 0) {
        Object.keys(name).forEach((key) => {
            studentData[`name.${key}`] = name[key as keyof typeof name];
        });
    }

    // Update the student document
    const result = await Faculty.findOneAndUpdate({ id }, studentData, {
        new: true,
    })
        .populate('academicDepartment')
        .populate('academicFaculty');

    return result;
};

const deleteFaculty = async (id: string): Promise<IFaculty | null> => {
    const result = await Faculty.findByIdAndDelete(id)
        .populate('academicDepartment')
        .populate('academicFaculty');
    return result;
};

export const FacultyService = {
    getAllFaculty,
    getSingleFaculty,
    updateFaculty,
    deleteFaculty,
};
