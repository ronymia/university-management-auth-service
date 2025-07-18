"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFilterableFields = exports.userSearchableFields = exports.EVENT_FACULTY_CREATED = exports.EVENT_ADMIN_CREATED = exports.EVENT_STUDENT_CREATED = void 0;
exports.EVENT_STUDENT_CREATED = 'student.created';
exports.EVENT_ADMIN_CREATED = 'admin.created';
exports.EVENT_FACULTY_CREATED = 'faculty.created';
exports.userSearchableFields = ['id', 'email'];
exports.userFilterableFields = [
    'searchTerm',
    'id',
    'email',
];
