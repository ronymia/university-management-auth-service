"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importDefault(require("mongoose"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const student_model_1 = require("./student.model");
const student_constant_1 = require("./student.constant");
const user_model_1 = require("../user/user.model");
const http_status_1 = __importDefault(require("http-status"));
const redis_1 = require("../../../shared/redis");
// GET SINGLE STUDENT
const getSingleStudent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield student_model_1.Student.findById(id);
    return result;
});
// GET ALL STUDENTS
const getAllStudents = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
    // search and filters condition
    const andConditions = [];
    // search condition $or
    if (searchTerm) {
        andConditions.push({
            $or: student_constant_1.studentSearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }
    // filters condition $and
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    const whereCondition = andConditions.length ? { $and: andConditions } : {};
    const sortCondition = {};
    if (sortBy && sortOrder) {
        sortCondition[sortBy] = sortOrder;
    }
    const result = yield student_model_1.Student.find(whereCondition)
        .populate('academicSemester')
        .populate('academicDepartment')
        .populate('academicFaculty')
        .sort(sortCondition)
        .skip(skip)
        .limit(limit);
    //
    const total = yield student_model_1.Student.countDocuments(whereCondition);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
// UPDATE STUDENT
const updateStudent = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield student_model_1.Student.findOne({ id });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Student not found');
    }
    const { name, guardian, localGuardian } = payload, student = __rest(payload, ["name", "guardian", "localGuardian"]);
    //
    // Create a new object to hold the update data
    const studentData = Object.assign({}, student);
    // Update the nested name fields
    if (name && Object.keys(name).length > 0) {
        Object.keys(name).forEach((key) => {
            studentData[`name.${key}`] = name[key];
        });
    }
    // Update the nested guardian fields
    if (guardian && Object.keys(guardian).length > 0) {
        Object.keys(guardian).forEach((key) => {
            studentData[`guardian.${key}`] =
                guardian[key];
        });
    }
    // Update the nested localGuardian fields
    if (localGuardian && Object.keys(localGuardian).length > 0) {
        Object.keys(localGuardian).forEach((key) => {
            studentData[`localGuardian.${key}`] =
                localGuardian[key];
        });
    }
    // Update the student document
    const result = yield student_model_1.Student.findOneAndUpdate({ id }, studentData, {
        new: true,
    })
        .populate('academicSemester')
        .populate('academicDepartment')
        .populate('academicFaculty');
    // PUBLISH ON REDIS
    if (result) {
        yield redis_1.RedisClient.publish(student_constant_1.EVENT_STUDENT_UPDATED, JSON.stringify(result));
    }
    return result;
});
// DELETE STUDENT
const deleteStudent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = student_model_1.Student.findOne({ id });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Student not found');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const student = yield student_model_1.Student.findByIdAndDelete(id)
            .populate('academicSemester')
            .populate('academicDepartment')
            .populate('academicFaculty');
        if (!student) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Fail to delete Student');
        }
        yield user_model_1.User.deleteOne({ id });
        session.commitTransaction();
        session.endSession();
        // PUBLISH ON REDIS
        if (student) {
            yield redis_1.RedisClient.publish(student_constant_1.EVENT_STUDENT_DELETED, JSON.stringify(student));
        }
        return student;
    }
    catch (error) {
        session.commitTransaction();
        session.endSession();
        throw error;
    }
});
// EXPORT SERVICES
exports.StudentService = {
    getAllStudents,
    getSingleStudent,
    updateStudent,
    deleteStudent,
};
