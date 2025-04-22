"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicFacultyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const academicFaculty_controller_1 = require("./academicFaculty.controller");
const academicFaculty_validation_1 = require("./academicFaculty.validation");
const router = express_1.default.Router();
router
    .route('/')
    .post((0, validateRequest_1.default)(academicFaculty_validation_1.AcademicFacultyValidation.createAcademicFacultyZodSchema), academicFaculty_controller_1.AcademicFacultyController.createAcademicFaculty)
    .get(academicFaculty_controller_1.AcademicFacultyController.getAllAcademicFaculties);
router
    .route('/:id')
    .get(academicFaculty_controller_1.AcademicFacultyController.getSingleAcademicFaculty)
    .patch((0, validateRequest_1.default)(academicFaculty_validation_1.AcademicFacultyValidation.updateAcademicFacultyZodSchema), academicFaculty_controller_1.AcademicFacultyController.updateAcademicFaculty)
    .delete(academicFaculty_controller_1.AcademicFacultyController.deleteAcademicFaculty);
exports.AcademicFacultyRoutes = router;
