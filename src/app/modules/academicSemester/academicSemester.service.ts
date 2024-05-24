import ApiError from '../../../errors/ApiError';
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

export const AcademicSemesterService = {
    createAcademicSemester,
};
