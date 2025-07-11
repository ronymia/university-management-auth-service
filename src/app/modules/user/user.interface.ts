/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { IStudent } from '../student/student.interface';
import { IFaculty } from '../faculty/faculty.interface';
import { IAdmin } from '../admin/admin.interface';

export type IUser = {
    id: string;
    role: string;
    password: string;
    status: string;
    needsChangePassword: true | false;
    passwordChangedAt?: Date;
    student?: Types.ObjectId | IStudent;
    faculty?: Types.ObjectId | IFaculty;
    admin?: Types.ObjectId | IAdmin;
};

export type IUserMethods = {
    isUserExist(id: string): Promise<Partial<IUser> | null>;
    isPasswordMatch(
        givenPasswords: string,
        savedPassword: string,
    ): Promise<boolean>;
};

// Create a new Model type that knows about IUserMethods
export type UserModel = Model<IUser, Record<string, never>, IUserMethods>;

//
export type IUserFilterRequest = {
    searchTerm?: string;
    id?: string;
    studentId?: string;
    facultyId?: string;
    adminId?: string;
    email?: string;
    role?: string;
};

export type IUserFilters = keyof IUserFilterRequest;
