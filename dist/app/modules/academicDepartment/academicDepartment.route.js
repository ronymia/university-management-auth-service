"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicDepartmentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const academicDepartment_validation_1 = require("./academicDepartment.validation");
const academicDepartment_controller_1 = require("./academicDepartment.controller");
const router = express_1.default.Router();
router
    .route('/')
    .post((0, validateRequest_1.default)(academicDepartment_validation_1.AcademicDepartmentValidation.createAcademicDepartmentZodSchema), academicDepartment_controller_1.AcademicDepartmentController.createAcademicDepartment)
    .get(academicDepartment_controller_1.AcademicDepartmentController.getAllAcademicDepartments);
router
    .route('/:id')
    .get(academicDepartment_controller_1.AcademicDepartmentController.getSingleAcademicDepartment)
    .patch((0, validateRequest_1.default)(academicDepartment_validation_1.AcademicDepartmentValidation.updateAcademicDepartmentZodSchema), academicDepartment_controller_1.AcademicDepartmentController.updateAcademicDepartment)
    .delete(academicDepartment_controller_1.AcademicDepartmentController.deleteAcademicDepartment);
exports.AcademicDepartmentRoutes = router;
