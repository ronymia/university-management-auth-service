import { z } from 'zod';
import { bloodGroup, gender } from '../student/student.constant';
import { designation } from '../faculty/faculty.constant';

//
const createStudentZodSchema = z.object({
    body: z.object({
        password: z.string().optional(),
        student: z.object({
            name: z.object({
                firstName: z.string({
                    required_error: 'First Name is required',
                }),
                middleName: z.string().optional(),
                lastName: z.string({ required_error: 'Last Name is required' }),
            }),
            gender: z.enum([...gender] as [string, ...string[]]).optional(),
            dateOfBirth: z.string().optional(),
            email: z.string({ required_error: 'Email is required' }),
            bloodGroup: z
                .enum([...bloodGroup] as [string, ...string[]])
                .optional(),
            contactNo: z.string({ required_error: 'Contact is required' }),
            emergencyContactNo: z.string({
                required_error: 'Emergency Contact is required',
            }),
            presentAddress: z.string({
                required_error: 'Present Address is required',
            }),
            permanentAddress: z.string({
                required_error: 'Permanent Address is required',
            }),
            guardian: z.object({
                fatherName: z.string({
                    required_error: 'Father Name is required',
                }),
                fatherOccupation: z.string({
                    required_error: 'FatherOccupation is required',
                }),
                fatherContactNo: z.string({
                    required_error: 'Father Contact Number is required',
                }),
                motherName: z.string({
                    required_error: 'Mother Name is required',
                }),
                motherOccupation: z.string({
                    required_error: 'MotherOccupation is required',
                }),
                motherContactNo: z.string({
                    required_error: 'Mother Contact Number is required',
                }),
            }),
            localGuardian: z.object({
                name: z.string({
                    required_error: 'Local Guardian Name is required',
                }),
                contactNo: z.string({
                    required_error: 'Local Guardian Contact Number is required',
                }),
                address: z.string({
                    required_error: 'Local Guardian Address is required',
                }),
            }),
            profileImage: z.string().optional(),
            academicSemester: z.string({
                required_error: 'Academic Semester is required',
            }),
            academicDepartment: z.string({
                required_error: 'Academic Department is required',
            }),
            academicFaculty: z.string({
                required_error: 'Academic Faculty is required',
            }),
        }),
    }),
});

// Faculty
const createFacultyZodSchema = z.object({
    body: z.object({
        password: z.string().optional(),
        faculty: z.object({
            name: z.object({
                firstName: z.string({
                    required_error: 'First Name is required',
                }),
                middleName: z.string().optional(),
                lastName: z.string({ required_error: 'Last Name is required' }),
            }),
            gender: z.enum([...gender] as [string, ...string[]]).optional(),
            dateOfBirth: z.string().optional(),
            email: z.string({ required_error: 'Email is required' }),
            bloodGroup: z
                .enum([...bloodGroup] as [string, ...string[]])
                .optional(),
            contactNo: z.string({ required_error: 'Contact is required' }),
            emergencyContactNo: z.string({
                required_error: 'Emergency Contact is required',
            }),
            presentAddress: z.string({
                required_error: 'Present Address is required',
            }),
            permanentAddress: z.string({
                required_error: 'Permanent Address is required',
            }),
            designation: z.enum([...designation] as [string, ...string[]], {
                required_error: 'Designation is required',
            }),
            profileImage: z.string().optional(),
            academicDepartment: z.string({
                required_error: 'Academic Department is required',
            }),
            academicFaculty: z.string({
                required_error: 'Academic Faculty is required',
            }),
        }),
    }),
});

export const UserValidation = {
    createStudentZodSchema,
    createFacultyZodSchema,
};
