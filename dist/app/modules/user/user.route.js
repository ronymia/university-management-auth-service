"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
// CREATE Student
router.post('/create-student', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.FACULTY), 
// validateRequest(UserValidation.createStudentZodSchema),
user_controller_1.UserController.createStudent);
// CREATE Faculty
router.post('/create-faculty', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), 
// validateRequest(UserValidation.createFacultyZodSchema),
user_controller_1.UserController.createFaculty);
// CREATE ADMIN
router.post('/create-admin', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN), 
// validateRequest(UserValidation.createAdminZodSchema),
user_controller_1.UserController.createAdmin);
// GET ALL USERS
router.get('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN), user_controller_1.UserController.getAllUsers);
// GET SINGLE USER
router.get('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.FACULTY, user_1.ENUM_USER_ROLE.STUDENT), user_controller_1.UserController.getSingleUser);
// UPDATE USER
router.patch('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.FACULTY, user_1.ENUM_USER_ROLE.STUDENT), 
// validateRequest(UserValidation.updateUserZodSchema),
user_controller_1.UserController.updateUser);
// DELETE USER
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), user_controller_1.UserController.deleteUser);
exports.UserRoutes = router;
