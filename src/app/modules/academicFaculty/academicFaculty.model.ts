import { Schema, model } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status-codes';
import {
    AcademicFacultyModel,
    IAcademicFaculty,
} from './academicFaculty.interface';

const academicFacultySchema = new Schema<
    IAcademicFaculty,
    AcademicFacultyModel
>(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        academicDepartments: {
            type: [Schema.Types.ObjectId],
            ref: 'AcademicDepartment',
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

// Remove any unique constraint from the academicDepartments field
academicFacultySchema.index({ academicDepartments: 1 }, { unique: false });

academicFacultySchema.pre('save', async function (next) {
    const existAcademicFaculty = await AcademicFaculty.findOne({
        title: this.title,
    });
    if (existAcademicFaculty) {
        throw new ApiError(
            httpStatus.CONFLICT,
            'Academic Faculty already exists',
        );
    }

    const faculty = this as IAcademicFaculty;

    // Check for duplicate academicDepartments in other documents
    const existingFaculty = await AcademicFaculty.findOne({
        academicDepartments: { $in: faculty.academicDepartments },
    });

    if (existingFaculty) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            'Duplicate academic department found',
        );
    }

    next();
});

academicFacultySchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate() as IAcademicFaculty;

    if (update.academicDepartments) {
        const existingFaculty = await AcademicFaculty.findOne({
            academicDepartments: { $in: update.academicDepartments },
        });

        if (
            existingFaculty &&
            existingFaculty._id.toString() !== this.getQuery()._id.toString()
        ) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                'Duplicate academic department found',
            );
        }
    }

    next();
});

export const AcademicFaculty = model<IAcademicFaculty, AcademicFacultyModel>(
    'AcademicFaculty',
    academicFacultySchema,
);
