import { SortOrder } from 'mongoose';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { academicFacultySearchableFields } from './academicFaculty.constant';
import {
    IAcademicFaculty,
    IAcademicFacultyFilters,
} from './academicFaculty.interface';
import { AcademicFaculty } from './academicFaculty.model';

const createAcademicFaculty = async (
    payload: IAcademicFaculty,
): Promise<IAcademicFaculty | null> => {
    const result = await AcademicFaculty.create(payload);
    return result;
};

const getSingleAcademicFaculty = async (
    id: string,
): Promise<IAcademicFaculty | null> => {
    const result = await AcademicFaculty.findById(id);
    return result;
};

const getAllAcademicFaculty = async (
    filters: IAcademicFacultyFilters,
    paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IAcademicFaculty[]>> => {
    const { searchTerm, ...filtersData } = filters;

    // search and filters condition
    const andCondition = [];

    // search condition $or
    if (searchTerm) {
        andCondition.push({
            $or: academicFacultySearchableFields.map((field) => ({
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
    const result = await AcademicFaculty.find(whereCondition)
        .sort(sortCondition)
        .skip(skip)
        .limit(limit);

    //
    const total = await AcademicFaculty.countDocuments();

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};

const updateAcademicFaculty = async (
    id: string,
    payload: Partial<IAcademicFaculty>,
): Promise<IAcademicFaculty | null> => {
    const result = await AcademicFaculty.findOneAndUpdate(
        { _id: id },
        payload,
        { new: true },
    );
    return result;
};

const deleteAcademicFaculty = async (
    id: string,
): Promise<IAcademicFaculty | null> => {
    const result = await AcademicFaculty.findByIdAndDelete(id);
    return result;
};

export const AcademicFacultyService = {
    createAcademicFaculty,
    getAllAcademicFaculty,
    getSingleAcademicFaculty,
    updateAcademicFaculty,
    deleteAcademicFaculty,
};
