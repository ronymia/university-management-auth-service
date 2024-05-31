import express from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { AcademicSemesterRoutes } from '../modules/academicSemester/academicSemester.route';
import { AcademicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.route';
const router = express.Router();

const moduleRoutes = [
    {
        path: '/users/',
        route: UserRoutes,
    },
    {
        path: '/academic-semester/',
        route: AcademicSemesterRoutes,
    },
    {
        path: '/academic-faculty/',
        route: AcademicFacultyRoutes,
    },
];

moduleRoutes.forEach(({ path, route }) => router.use(path, route));

export const Routes = router;
