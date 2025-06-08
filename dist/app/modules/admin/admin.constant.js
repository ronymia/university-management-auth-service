"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_ADMIN_DELETED = exports.EVENT_ADMIN_UPDATED = exports.adminSearchableFields = exports.adminFilterableFields = void 0;
exports.adminFilterableFields = [
    'searchTerm',
    'id',
    'gender',
    'bloodGroup',
    'email',
    'contactNo',
    'emergencyContactNo',
    'managementDepartment',
    'designation',
];
exports.adminSearchableFields = [
    'email',
    'contactNo',
    'emergencyContactNo',
    'name.firstName',
    'name.lastName',
    'name.middleName',
];
// export const EVENT_ADMIN_CREATED = 'admin.created';
exports.EVENT_ADMIN_UPDATED = 'admin.updated';
exports.EVENT_ADMIN_DELETED = 'admin.deleted';
