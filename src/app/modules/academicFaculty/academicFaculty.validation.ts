import { z } from 'zod';

const createAcademicFacultyZodSchema = z.object({
    body: z.object({
        title: z.string({
            required_error: 'Title is required',
        }),
        academicDepartments: z
            .array(
                z.string({
                    required_error: 'Academic Department ID is required',
                }),
            )
            .min(1, 'At least one Academic Department is required'),
    }),
});

const updateAcademicFacultyZodSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        academicDepartments: z
            .array(
                z.string({
                    required_error: 'Academic Department ID is required',
                }),
            )
            .optional(),
    }),
});

export const AcademicFacultyValidation = {
    createAcademicFacultyZodSchema,
    updateAcademicFacultyZodSchema,
};
