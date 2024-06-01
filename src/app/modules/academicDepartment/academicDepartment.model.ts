import { Schema, model } from 'mongoose';
import httpStatus from 'http-status-codes';
import {
    AcademicDepartmentModel,
    IAcademicDepartment,
} from './academicDepartment.interface';
import ApiError from '../../../errors/ApiError';

const academicDepartmentSchema = new Schema<IAcademicDepartment>(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        academicFaculty: {
            type: Schema.Types.ObjectId,
            ref: 'AcademicFaculty',
            required: true,
            unique: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
    },
);

academicDepartmentSchema.pre('save', async function () {
    const existAcademicDepartment = await AcademicDepartment.findOne({
        title: this.title,
    });
    if (existAcademicDepartment) {
        throw new ApiError(
            httpStatus.CONFLICT,
            'Academic Department already exists',
        );
    }
});

export const AcademicDepartment = model<
    IAcademicDepartment,
    AcademicDepartmentModel
>('AcademicDepartment', academicDepartmentSchema);
