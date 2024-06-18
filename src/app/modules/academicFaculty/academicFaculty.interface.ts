import { Model, Types } from 'mongoose';
import { IAcademicDepartment } from '../academicDepartment/academicDepartment.interface';

export type IAcademicFaculty = {
    title: string;
    academicDepartments: Types.ObjectId[] | IAcademicDepartment[]; // Refer id
};

export type AcademicFacultyModel = Model<IAcademicFaculty, object>;

export type IAcademicFacultyFilters = {
    searchTerm?: string;
    academicDepartment?: Types.ObjectId[];
};
