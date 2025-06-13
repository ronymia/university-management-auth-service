"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_FACULTY_DELETED = exports.EVENT_FACULTY_UPDATED = exports.facultySearchableFields = exports.facultyFilterableFields = exports.designation = exports.gender = exports.bloodGroup = void 0;
exports.bloodGroup = [
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-',
];
exports.gender = ['male', 'female'];
exports.designation = [
    'Professor',
    'Lecturer',
    'Assistant Lecturer',
    'Assistant Professor',
    'Associate Professor',
    'Senior Professor',
];
exports.facultyFilterableFields = [
    'searchTerm',
    'email',
    'contactNo',
    'bloodGroup',
    'gender',
];
exports.facultySearchableFields = [
    'name.firstName',
    'name.middleName',
    'name.lastName',
    'id',
    'email',
    'contactNo',
];
exports.EVENT_FACULTY_UPDATED = 'faculty.updated';
exports.EVENT_FACULTY_DELETED = 'faculty.deleted';
