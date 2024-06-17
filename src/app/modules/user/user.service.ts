import mongoose from 'mongoose';
import config from '../../../config/index';
import ApiError from '../../../errors/ApiError';
import { IAcademicSemester } from '../academicSemester/academicSemester.interface';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { IStudent } from '../student/student.interface';
import { IUser } from './user.interface';
import { User } from './user.model';
import { generateFacultyId, generateStudentId } from './user.utils';
import { Student } from '../student/student.model';
import httpStatus from 'http-status-codes';
import { IFaculty } from '../faculty/faculty.interface';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { Faculty } from '../faculty/faculty.model';

const createStudent = async (
    student: IStudent,
    user: IUser,
): Promise<IUser | null> => {
    // SET ROLE
    user.role = ENUM_USER_ROLE.STUDENT;

    // SET DEFAULT PASSWORD
    if (!user.password) {
        user.password = config.default_student_pass as string;
    }

    // GET ACADEMIC SEMESTER
    const academicSemester = (await AcademicSemester.findById(
        student.academicSemester,
    )) as IAcademicSemester | null;

    let newUserData = null;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        // AUTO GENERATED INCREMENTAL STUDENT ID
        const studentId = await generateStudentId(academicSemester);
        user.id = studentId;
        student.id = studentId;

        //  CREATING STUDENT
        const newStudent = await Student.create([student], { session });
        if (!newStudent.length) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                'Failed to create student',
            );
        }

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
        session.commitTransaction();
        session.endSession();
    } catch (error) {
        session.abortTransaction();
        session.endSession();
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
const createFaculty = async (
    faculty: IFaculty,
    user: IUser,
): Promise<IUser | null> => {
    // SET ROLE
    user.role = ENUM_USER_ROLE.FACULTY;

    // SET DEFAULT PASSWORD
    if (!user.password) {
        user.password = config.default_faculty_pass as string;
    }

    let newUserData = null;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        // AUTO GENERATED INCREMENTAL STUDENT ID
        const facultyId = await generateFacultyId();
        user.id = facultyId;

        //  CREATING STUDENT
        const newFaculty = await Faculty.create([faculty], { session });
        if (!newFaculty.length) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                'Failed to create faculty',
            );
        }

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
        session.commitTransaction();
        session.endSession();
    } catch (error) {
        session.abortTransaction();
        session.endSession();
        throw error;
    }

    if (newUserData) {
        newUserData = await User.findOne({ id: newUserData.id }).populate({
            path: 'faculty',
            // model: 'Student',
            populate: [
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

export const UserService = {
    createStudent,
    createFaculty,
};
