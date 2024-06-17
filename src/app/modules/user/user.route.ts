import express from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
const router = express.Router();

// Student
router.post(
    '/create-student',
    validateRequest(UserValidation.createStudentZodSchema),
    UserController.createStudent,
);

// Faculty
router.post(
    '/create-faculty',
    validateRequest(UserValidation.createFacultyZodSchema),
    UserController.createFaculty,
);

export const UserRoutes = router;
