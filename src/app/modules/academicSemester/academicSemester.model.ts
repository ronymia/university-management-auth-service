import { Schema, model } from 'mongoose';
import {
    IAcademicSemester,
    AcademicSemesterModel,
} from './academicSemester.interface';
import {
    academicSemesterMonths,
    academicSemesterTitles,
    academicSemesterCodes,
} from './academicSemester.constant';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status-codes';

const academicSemesterSchema = new Schema<IAcademicSemester>(
    {
        title: {
            type: String,
            required: true,
            enum: academicSemesterTitles,
        },
        year: {
            type: Number,
            required: true,
        },
        code: {
            type: String,
            required: true,
            enum: academicSemesterCodes,
        },
        startMonth: {
            type: String,
            required: true,
            enum: academicSemesterMonths,
        },
        endMonth: {
            type: String,
            required: true,
            enum: academicSemesterMonths,
        },
    },
    {
        timestamps: true,
    },
);

academicSemesterSchema.pre('save', async function () {
    const existAcademicSemester = await AcademicSemester.findOne({
        title: this.title,
        year: this.year,
    });
    if (existAcademicSemester) {
        throw new ApiError(
            httpStatus.CONFLICT,
            'Academic Semester already exists',
        );
    }
});

export const AcademicSemester = model<IAcademicSemester, AcademicSemesterModel>(
    'AcademicSemester',
    academicSemesterSchema,
);
