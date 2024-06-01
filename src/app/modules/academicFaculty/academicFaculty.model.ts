import { Schema, model } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status-codes';
import {
    AcademicFacultyModel,
    IAcademicFaculty,
} from './academicFaculty.interface';

const academicFacultySchema = new Schema<IAcademicFaculty>(
    {
        title: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
    },
);

academicFacultySchema.pre('save', async function () {
    const existAcademicFaculty = await AcademicFaculty.findOne({
        title: this.title,
    });
    if (existAcademicFaculty) {
        throw new ApiError(
            httpStatus.CONFLICT,
            'Academic Faculty already exists',
        );
    }
});

export const AcademicFaculty = model<IAcademicFaculty, AcademicFacultyModel>(
    'AcademicFaculty',
    academicFacultySchema,
);
