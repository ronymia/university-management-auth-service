import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemesterValidation } from './academicSemester.validation';
import { AcademicSemesterController } from './academicSemester.controller';
const router = express.Router();

router.post(
    '/create-academic-semester',
    validateRequest(AcademicSemesterValidation.createAcademicSemesterZodSchema),
    AcademicSemesterController.createAcademicSemester,
);

router.get('/:id', AcademicSemesterController.getSingleAcademicSemester);
router.patch(
    '/:id',
    validateRequest(AcademicSemesterValidation.updateAcademicSemesterZodSchema),
    AcademicSemesterController.updateAcademicSemester,
);
router.delete('/:id', AcademicSemesterController.deleteAcademicSemester);

router.get('/', AcademicSemesterController.getAllAcademicSemesters);

export const AcademicSemesterRoutes = router;
