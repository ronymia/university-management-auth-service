import mongoose from 'mongoose';
import config from '../../../config/index';
import ApiError from '../../../errors/ApiError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { IStudent } from '../student/student.interface';
import { IUser } from './user.interface';
import { User } from './user.model';
import {
    generateAdminId,
    generateFacultyId,
    generateStudentId,
} from './user.utils';
import { Student } from '../student/student.model';
import { IFaculty } from '../faculty/faculty.interface';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { Faculty } from '../faculty/faculty.model';
import { IAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';
import httpStatus from 'http-status';

// Create Student
const createStudent = async (
    student: IStudent,
    user: IUser,
): Promise<IUser | null> => {
    // SET ROLE
    user.role = ENUM_USER_ROLE.STUDENT;

    // IF PASSWORD IS NOT GIVEN, SET DEFAULT PASSWORD
    if (!user.password) {
        user.password = config.default_student_pass as string;
    }

    // GET ACADEMIC SEMESTER
    const academicSemester = await AcademicSemester.findById(
        student.academicSemester,
    ).lean();

    let newUserData = null;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        // AUTO GENERATED INCREMENTAL STUDENT ID
        const studentId = await generateStudentId(academicSemester);
        user.id = studentId;
        student.id = studentId;

        //  CREATING STUDENT USING SESSION
        const newStudent = await Student.create([student], { session });
        if (!newStudent.length) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                'Failed to create student',
            );
        }

        //  SET STUDENT _id (reference) TO user.student
        user.student = newStudent[0]._id;

        //  CREATING USER
        const newUser = await User.create([user], { session });
        if (!newUser.length) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                'Failed to create student',
            );
        }

        newUserData = newUser[0];
        await session.commitTransaction();
        await session.endSession();
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }

    if (newUserData) {
        newUserData = await User.findOne({ id: newUserData.id }).populate({
            path: 'student',
            // model: 'Student',
            populate: [
                {
                    path: 'academicSemester',
                    // model: 'AcademicSemester',
                },
                {
                    path: 'academicDepartment',
                    // model: 'AcademicDepartment',
                },
                {
                    path: 'academicFaculty',
                    // model: 'AcademicFaculty',
                },
            ],
        });
    }

    return newUserData;
};

// Create Faculty
const createFaculty = async (
    faculty: IFaculty,
    user: IUser,
): Promise<IUser | null> => {
    // SET ROLE
    user.role = ENUM_USER_ROLE.FACULTY;

    // IF PASSWORD IS NOT GIVEN, SET DEFAULT PASSWORD
    if (!user.password) {
        user.password = config.default_faculty_pass as string;
    }

    let newUserData = null;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        // AUTO GENERATED INCREMENTAL FACULTY ID
        const facultyId = await generateFacultyId();
        user.id = facultyId;
        faculty.id = facultyId;

        //  CREATING FACULTY
        const newFaculty = await Faculty.create([faculty], { session });
        if (!newFaculty.length) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                'Failed to create faculty',
            );
        }

        //  SET Faculty _id (reference) TO user.faculty
        user.faculty = newFaculty[0]._id;

        //  CREATING USER
        const newUser = await User.create([user], { session });
        if (!newUser.length) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                'Failed to create faculty',
            );
        }

        newUserData = newUser[0];
        await session.commitTransaction();
        await session.endSession();
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }

    if (newUserData) {
        newUserData = await User.findOne({ id: newUserData.id }).populate({
            path: 'faculty',
            populate: [
                {
                    path: 'academicDepartment',
                },
                {
                    path: 'academicFaculty',
                },
            ],
        });
    }

    return newUserData;
};

const createAdmin = async (
    admin: IAdmin,
    user: IUser,
): Promise<IUser | null> => {
    // default password
    if (!user.password) {
        user.password = config.default_admin_pass as string;
    }
    // set role
    user.role = 'admin';

    // generate faculty id
    let newUserAllData = null;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const id = await generateAdminId();
        user.id = id;
        admin.id = id;

        const newAdmin = await Admin.create([admin], { session });

        if (!newAdmin.length) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                'Failed to create faculty ',
            );
        }

        user.admin = newAdmin[0]._id;

        const newUser = await User.create([user], { session });

        if (!newUser.length) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                'Failed to create admin',
            );
        }
        newUserAllData = newUser[0];

        await session.commitTransaction();
        await session.endSession();
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }

    if (newUserAllData) {
        newUserAllData = await User.findOne({ id: newUserAllData.id }).populate(
            {
                path: 'admin',
                populate: [
                    {
                        path: 'managementDepartment',
                    },
                ],
            },
        );
    }

    return newUserAllData;
};

export const UserService = {
    createStudent,
    createFaculty,
    createAdmin,
};
