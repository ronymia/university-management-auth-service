import { SortOrder } from 'mongoose';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { academicDepartmentSearchableFields } from './academicDepartment.constant';
import {
    IAcademicDepartment,
    IAcademicDepartmentFilters,
} from './academicDepartment.interface';
import { AcademicDepartment } from './academicDepartment.model';

const createAcademicDepartment = async (
    payload: IAcademicDepartment,
): Promise<IAcademicDepartment | null> => {
    const result = await AcademicDepartment.create(payload);
    return result;
};

const getSingleAcademicDepartment = async (
    id: string,
): Promise<IAcademicDepartment | null> => {
    const result = await AcademicDepartment.findById(id);
    return result;
};

const getAllAcademicDepartments = async (
    filters: IAcademicDepartmentFilters,
    paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IAcademicDepartment[]>> => {
    const { searchTerm, ...filtersData } = filters;

    // search and filters condition
    const andCondition = [];

    // search condition $or
    if (searchTerm) {
        andCondition.push({
            $or: academicDepartmentSearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }

    // const andCondition = [
    //     {
    //         $or: [
    //             {
    //                 title: {
    //                     $regex: searchTerm,
    //                     $options: 'i',
    //                 },
    //             },
    //             {
    //                 code: {
    //                     $regex: searchTerm,
    //                     $options: 'i',
    //                 },
    //             },
    //             {
    //                 year: {
    //                     $regex: searchTerm,
    //                     $options: 'i',
    //                 },
    //             },
    //         ],
    //     },
    // ];

    // filters condition $and
    if (Object.keys(filtersData).length) {
        andCondition.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }

    const whereCondition = andCondition.length ? { $and: andCondition } : {};

    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelper.calculatePagination(paginationOptions);

    const sortCondition: { [keyof: string]: SortOrder } = {};

    if (sortBy && sortOrder) {
        sortCondition[sortBy] = sortOrder;
    }
    const result = await AcademicDepartment.find(whereCondition)
        .sort(sortCondition)
        .skip(skip)
        .limit(limit);

    //
    const total = await AcademicDepartment.countDocuments(whereCondition);

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};

const updateAcademicDepartment = async (
    id: string,
    payload: Partial<IAcademicDepartment>,
): Promise<IAcademicDepartment | null> => {
    const result = await AcademicDepartment.findOneAndUpdate(
        { _id: id },
        payload,
        { new: true },
    );
    return result;
};

const deleteAcademicDepartment = async (
    id: string,
): Promise<IAcademicDepartment | null> => {
    const result = await AcademicDepartment.findByIdAndDelete(id);
    return result;
};

export const AcademicDepartmentService = {
    createAcademicDepartment,
    getAllAcademicDepartments,
    getSingleAcademicDepartment,
    updateAcademicDepartment,
    deleteAcademicDepartment,
};
