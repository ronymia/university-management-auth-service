import { Schema, model } from 'mongoose';
import httpStatus from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import {
    IManagementDepartment,
    ManagementDepartmentModel,
} from './managementDepartment.interface';

const managementDepartmentSchema = new Schema<
    IManagementDepartment,
    ManagementDepartmentModel
>(
    {
        title: {
            type: String,
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

managementDepartmentSchema.pre('save', async function () {
    const existManagementDepartment = await ManagementDepartment.findOne({
        title: this.title,
    });
    if (existManagementDepartment) {
        throw new ApiError(
            httpStatus.CONFLICT,
            'Management Department already exists',
        );
    }
});

export const ManagementDepartment = model<
    IManagementDepartment,
    ManagementDepartmentModel
>('ManagementDepartment', managementDepartmentSchema);
