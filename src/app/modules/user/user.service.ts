import mongoose from 'mongoose';
import config from '../../../config/index';
import ApiError from '../../../errors/ApiError';
import { IAcademicSemester } from '../academicSemester/academicSemester.interface';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { IStudent } from '../student/student.interface';
import { IUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';
import { Student } from '../student/student.model';
import httpStatus from 'http-status-codes';

const createStudent = async (
    student: IStudent,
    user: IUser,
): Promise<IUser | null> => {
    // SET ROLE
    user.role = 'student';

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

export const UserService = {
    createStudent,
};
