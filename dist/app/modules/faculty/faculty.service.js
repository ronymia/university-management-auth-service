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
exports.FacultyService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importDefault(require("mongoose"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const faculty_model_1 = require("./faculty.model");
const faculty_constant_1 = require("./faculty.constant");
const user_model_1 = require("../user/user.model");
const http_status_1 = __importDefault(require("http-status"));
const redis_1 = require("../../../shared/redis");
const academicFaculty_model_1 = require("../academicFaculty/academicFaculty.model");
const academicDepartment_model_1 = require("../academicDepartment/academicDepartment.model");
const getSingleFaculty = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield faculty_model_1.Faculty.findOne({ id })
        .populate('academicDepartment')
        .populate('academicFaculty');
    return result;
});
const getAllFaculties = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
    // search and filters condition
    const andConditions = [];
    // search condition $or
    if (searchTerm) {
        andConditions.push({
            $or: faculty_constant_1.facultySearchableFields.map((field) => ({
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
    const result = yield faculty_model_1.Faculty.find(whereCondition)
        .populate('academicDepartment')
        .populate('academicFaculty')
        .sort(sortCondition)
        .skip(skip)
        .limit(limit);
    //
    const total = yield faculty_model_1.Faculty.countDocuments(whereCondition);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const updateFaculty = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    //
    const { name, academicFaculty, academicDepartment } = payload, faculty = __rest(payload, ["name", "academicFaculty", "academicDepartment"]);
    //
    const isExist = yield faculty_model_1.Faculty.findOne({ id });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Faculty not found');
    }
    // Create a new object to hold the update data
    const facultyData = Object.assign({}, faculty);
    // Resolve syncIds to actual MongoDB _ids
    let resolvedFacultyId = isExist.academicFaculty;
    let resolvedDepartmentId = isExist.academicDepartment;
    if (academicFaculty) {
        const facultyDoc = yield academicFaculty_model_1.AcademicFaculty.findOne({
            syncId: academicFaculty,
        });
        if (facultyDoc) {
            facultyData.academicFaculty = facultyDoc._id;
            resolvedFacultyId = facultyDoc._id;
        }
    }
    if (academicDepartment) {
        const departmentDoc = yield academicDepartment_model_1.AcademicDepartment.findOne({
            syncId: academicDepartment,
        });
        if (departmentDoc) {
            facultyData.academicDepartment = departmentDoc._id;
            resolvedDepartmentId = departmentDoc._id;
        }
    }
    // CHECK ACADEMIC DEPARTMENT
    if (academicFaculty || academicDepartment) {
        const getAcademicDepartment = yield academicDepartment_model_1.AcademicDepartment.findOne({
            _id: resolvedDepartmentId,
            academicFaculty: resolvedFacultyId,
        });
        if (!getAcademicDepartment) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Academic department not found for this faculty');
        }
    }
    // Update the nested name fields
    if (name && Object.keys(name).length > 0) {
        Object.keys(name).forEach((key) => {
            facultyData[`name.${key}`] = name[key];
        });
    }
    // Update the faculty document
    const result = yield faculty_model_1.Faculty.findOneAndUpdate({ id }, facultyData, {
        new: true,
    })
        .populate('academicDepartment')
        .populate('academicFaculty');
    // PUBLISH ON REDIS
    if (result) {
        yield redis_1.RedisClient.publish(faculty_constant_1.EVENT_FACULTY_UPDATED, JSON.stringify(result));
    }
    return result;
});
const deleteFaculty = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = faculty_model_1.Faculty.findOne({ id });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Faculty not found');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // delete faculty first
        const faculty = yield faculty_model_1.Faculty.findByIdAndDelete({ id }, { session });
        if (!faculty) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Failed to delete faculty');
        }
        //delete user
        yield user_model_1.User.deleteOne({ id });
        session.commitTransaction();
        session.endSession();
        // PUBLISH ON REDIS
        if (faculty) {
            yield redis_1.RedisClient.publish(faculty_constant_1.EVENT_FACULTY_DELETED, JSON.stringify(faculty));
        }
        return faculty;
    }
    catch (error) {
        session.commitTransaction();
        session.endSession();
        throw error;
    }
});
exports.FacultyService = {
    getAllFaculties,
    getSingleFaculty,
    updateFaculty,
    deleteFaculty,
};
