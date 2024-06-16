import { Model, Types } from 'mongoose';
import { IAcademicFaculty } from '../academicFaculty/academicFaculty.interface';

export type IAcademicDepartment = {
    title: string;
    academicFaculty: Types.ObjectId | IAcademicFaculty;
};

export type AcademicDepartmentModel = Model<IAcademicDepartment, object>;

export type IAcademicDepartmentFilterRequest = {
    searchTerm?: string;
    academicFaculty?: Types.ObjectId;
};

export type IAcademicDepartmentFilters = {
    searchTerm?: string;
    academicFaculty?: Types.ObjectId;
};
