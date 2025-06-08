"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Faculty = void 0;
const mongoose_1 = require("mongoose");
const faculty_constant_1 = require("./faculty.constant");
const facultySchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: false,
        unique: true,
    },
    name: {
        required: true,
        type: {
            firstName: {
                type: String,
                required: true,
            },
            middleName: {
                type: String,
                required: false,
            },
            lastName: {
                type: String,
                required: true,
            },
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    contactNo: {
        type: String,
        required: true,
        unique: true,
    },
    emergencyContactNo: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: faculty_constant_1.gender,
        required: false,
    },
    dateOfBirth: {
        type: String,
        // required: true,
    },
    bloodGroup: {
        type: String,
        enum: faculty_constant_1.bloodGroup,
    },
    presentAddress: {
        type: String,
        required: true,
    },
    permanentAddress: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true,
        enum: faculty_constant_1.designation,
    },
    profileImage: {
        type: String,
        required: false,
    },
    academicDepartment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'academicDepartment',
        required: true,
    },
    academicFaculty: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'academicFaculty',
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Faculty = (0, mongoose_1.model)('Faculty', facultySchema);
