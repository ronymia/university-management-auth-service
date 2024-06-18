import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ManagementDepartmentController } from './managementDepartment.controller';
import { ManagementDepartmentValidation } from './managementDepartment.validation';
const router = express.Router();

router.post(
    '/',
    validateRequest(
        ManagementDepartmentValidation.createManagementDepartmentZodSchema,
    ),
    ManagementDepartmentController.createManagementDepartment,
);

router.get('/', ManagementDepartmentController.getAllManagementDepartments);

router.get(
    '/:id',
    ManagementDepartmentController.getSingleManagementDepartment,
);

router.patch('/:id', ManagementDepartmentController.updateManagementDepartment);

router.delete(
    '/:id',
    ManagementDepartmentController.deleteManagementDepartment,
);

export const ManagementDepartmentRoutes = router;
