"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const student_constant_1 = require("../student/student.constant");
const faculty_constant_1 = require("../faculty/faculty.constant");
//
const createStudentZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string().optional(),
        student: zod_1.z.object({
            name: zod_1.z.object({
                firstName: zod_1.z.string({
                    required_error: 'First Name is required',
                }),
                middleName: zod_1.z.string().optional(),
                lastName: zod_1.z.string({ required_error: 'Last Name is required' }),
            }),
            gender: zod_1.z.enum([...student_constant_1.gender]).optional(),
            dateOfBirth: zod_1.z.string().optional(),
            email: zod_1.z.string({ required_error: 'Email is required' }),
            bloodGroup: zod_1.z
                .enum([...student_constant_1.bloodGroup])
                .optional(),
            contactNo: zod_1.z.string({ required_error: 'Contact is required' }),
            emergencyContactNo: zod_1.z.string({
                required_error: 'Emergency Contact is required',
            }),
            presentAddress: zod_1.z.string({
                required_error: 'Present Address is required',
            }),
            permanentAddress: zod_1.z.string({
                required_error: 'Permanent Address is required',
            }),
            guardian: zod_1.z.object({
                fatherName: zod_1.z.string({
                    required_error: 'Father Name is required',
                }),
                fatherOccupation: zod_1.z.string({
                    required_error: 'FatherOccupation is required',
                }),
                fatherContactNo: zod_1.z.string({
                    required_error: 'Father Contact Number is required',
                }),
                motherName: zod_1.z.string({
                    required_error: 'Mother Name is required',
                }),
                motherOccupation: zod_1.z.string({
                    required_error: 'MotherOccupation is required',
                }),
                motherContactNo: zod_1.z.string({
                    required_error: 'Mother Contact Number is required',
                }),
                address: zod_1.z.string({
                    required_error: 'Address is required',
                }),
            }),
            localGuardian: zod_1.z.object({
                name: zod_1.z.string({
                    required_error: 'Local Guardian Name is required',
                }),
                occupation: zod_1.z.string({
                    required_error: 'Local Guardian Occupation is required',
                }),
                contactNo: zod_1.z.string({
                    required_error: 'Local Guardian Contact Number is required',
                }),
                address: zod_1.z.string({
                    required_error: 'Local Guardian Address is required',
                }),
            }),
            profileImage: zod_1.z.string().optional(),
            academicSemester: zod_1.z.string({
                required_error: 'Academic Semester is required',
            }),
            academicDepartment: zod_1.z.string({
                required_error: 'Academic Department is required',
            }),
            academicFaculty: zod_1.z.string({
                required_error: 'Academic Faculty is required',
            }),
        }),
    }),
});
// Faculty
const createFacultyZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string().optional(),
        faculty: zod_1.z.object({
            name: zod_1.z.object({
                firstName: zod_1.z.string({
                    required_error: 'First Name is required',
                }),
                middleName: zod_1.z.string().optional(),
                lastName: zod_1.z.string({ required_error: 'Last Name is required' }),
            }),
            gender: zod_1.z.enum([...student_constant_1.gender]).optional(),
            dateOfBirth: zod_1.z.string().optional(),
            email: zod_1.z.string({ required_error: 'Email is required' }),
            bloodGroup: zod_1.z
                .enum([...student_constant_1.bloodGroup])
                .optional(),
            contactNo: zod_1.z.string({ required_error: 'Contact is required' }),
            emergencyContactNo: zod_1.z.string({
                required_error: 'Emergency Contact is required',
            }),
            presentAddress: zod_1.z.string({
                required_error: 'Present Address is required',
            }),
            permanentAddress: zod_1.z.string({
                required_error: 'Permanent Address is required',
            }),
            designation: zod_1.z.enum([...faculty_constant_1.designation], {
                required_error: 'Designation is required',
            }),
            profileImage: zod_1.z.string().optional(),
            academicDepartment: zod_1.z.string({
                required_error: 'Academic Department is required',
            }),
            academicFaculty: zod_1.z.string({
                required_error: 'Academic Faculty is required',
            }),
        }),
    }),
});
const createAdminZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string().optional(),
        admin: zod_1.z.object({
            name: zod_1.z.object({
                firstName: zod_1.z.string({
                    required_error: 'First name is required',
                }),
                lastName: zod_1.z.string({
                    required_error: 'Last name is required',
                }),
                middleName: zod_1.z.string().optional(),
            }),
            dateOfBirth: zod_1.z.string({
                required_error: 'Date of birth is required',
            }),
            gender: zod_1.z.string({
                required_error: 'Gender is required',
            }),
            bloodGroup: zod_1.z.string({
                required_error: 'Blood group is required',
            }),
            email: zod_1.z
                .string({
                required_error: 'Email is required',
            })
                .email(),
            contactNo: zod_1.z.string({
                required_error: 'Contact number is required',
            }),
            emergencyContactNo: zod_1.z.string({
                required_error: 'Emergency contact number is required',
            }),
            presentAddress: zod_1.z.string({
                required_error: 'Present address is required',
            }),
            permanentAddress: zod_1.z.string({
                required_error: 'Permanent address is required',
            }),
            managementDepartment: zod_1.z.string({
                required_error: 'Management department is required',
            }),
            designation: zod_1.z.string({
                required_error: 'Designation is required',
            }),
            profileImage: zod_1.z.string().optional(),
        }),
    }),
});
exports.UserValidation = {
    createStudentZodSchema,
    createFacultyZodSchema,
    createAdminZodSchema,
};
