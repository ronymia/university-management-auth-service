"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.facultySearchableFields = exports.facultyFilterableFields = exports.designation = exports.gender = exports.bloodGroup = void 0;
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
exports.designation = ['Professor', 'Lecturer'];
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
