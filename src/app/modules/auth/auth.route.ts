import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
const router = express.Router();

router.post(
    '/login',
    validateRequest(AuthValidation.loginZodSchema),
    AuthController.loginUser,
);
router.post(
    '/refresh-token',
    // validateRequest(AuthValidation.refreshTokenZodSchema),
    AuthController.refreshToken,
);
router.post(
    '/logout',
    // validateRequest(AuthValidation.refreshTokenZodSchema),
    AuthController.logout,
);

router.post(
    '/change-password',
    auth(
        ENUM_USER_ROLE.SUPER_ADMIN,
        ENUM_USER_ROLE.ADMIN,
        ENUM_USER_ROLE.FACULTY,
        ENUM_USER_ROLE.STUDENT,
    ),
    validateRequest(AuthValidation.changePasswordZodSchema),
    AuthController.changePassword,
);

export const AuthRoutes = router;
