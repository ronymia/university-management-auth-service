"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/user/user.route");
const academicSemester_route_1 = require("../modules/academicSemester/academicSemester.route");
const academicFaculty_route_1 = require("../modules/academicFaculty/academicFaculty.route");
const academicDepartment_route_1 = require("../modules/academicDepartment/academicDepartment.route");
const student_route_1 = require("../modules/student/student.route");
const faculty_route_1 = require("../modules/faculty/faculty.route");
const managementDepartment_route_1 = require("../modules/managementDepartment/managementDepartment.route");
const admin_route_1 = require("../modules/admin/admin.route");
const auth_route_1 = require("../modules/auth/auth.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/users/',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/auth/',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/academic-semesters/',
        route: academicSemester_route_1.AcademicSemesterRoutes,
    },
    {
        path: '/academic-faculties/',
        route: academicFaculty_route_1.AcademicFacultyRoutes,
    },
    {
        path: '/academic-departments/',
        route: academicDepartment_route_1.AcademicDepartmentRoutes,
    },
    {
        path: '/management-departments/',
        route: managementDepartment_route_1.ManagementDepartmentRoutes,
    },
    {
        path: '/students/',
        route: student_route_1.StudentRoutes,
    },
    {
        path: '/faculties/',
        route: faculty_route_1.FacultyRoutes,
    },
    {
        path: '/admins/',
        route: admin_route_1.AdminRoutes,
    },
];
moduleRoutes.forEach(({ path, route }) => router.use(path, route));
exports.Routes = router;
