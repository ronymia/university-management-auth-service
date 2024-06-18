import { Model } from 'mongoose';

export type IAcademicDepartment = {
    title: string;
    // academicFaculty: Types.ObjectId | IAcademicFaculty;
};

export type AcademicDepartmentModel = Model<IAcademicDepartment, object>;

export type IAcademicDepartmentFilterRequest = {
    searchTerm?: string;
    // academicFaculty?: Types.ObjectId;
};

export type IAcademicDepartmentFilters = {
    searchTerm?: string;
    // academicFaculty?: Types.ObjectId;
};
