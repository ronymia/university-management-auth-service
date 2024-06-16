import { BLOOD_GROUP, GENDER } from './student.interface';

export const bloodGroup: BLOOD_GROUP[] = [
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-',
];

export const gender: GENDER[] = ['male', 'female'];

export const studentFilterableFields = [
    'searchTerm',
    'name.firstName',
    'name.middleName',
    'name.lastName',
    'email',
    'contactNo',
    'bloodGroup',
    'gender',
];

export const studentSearchableFields: string[] = [
    'name.firstName',
    'name.middleName',
    'name.lastName',
    'id',
    'email',
    'contactNo',
];
