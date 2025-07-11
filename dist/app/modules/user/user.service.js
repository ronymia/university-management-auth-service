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
exports.UserService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = __importDefault(require("../../../config/index"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const academicSemester_model_1 = require("../academicSemester/academicSemester.model");
const user_model_1 = require("./user.model");
const user_utils_1 = require("./user.utils");
const student_model_1 = require("../student/student.model");
const user_1 = require("../../../enums/user");
const faculty_model_1 = require("../faculty/faculty.model");
const admin_model_1 = require("../admin/admin.model");
const http_status_1 = __importDefault(require("http-status"));
const redis_1 = require("../../../shared/redis");
const user_constant_1 = require("./user.constant");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
// Create Student
const createStudent = (student, user) => __awaiter(void 0, void 0, void 0, function* () {
    // SET ROLE
    user.role = user_1.ENUM_USER_ROLE.STUDENT;
    // IF PASSWORD IS NOT GIVEN, SET DEFAULT PASSWORD
    if (!user.password) {
        user.password = index_1.default.default_student_pass;
    }
    // GET ACADEMIC SEMESTER
    const academicSemester = yield academicSemester_model_1.AcademicSemester.findById(student.academicSemester).lean();
    let newUserData = null;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // AUTO GENERATED INCREMENTAL STUDENT ID
        const studentId = yield (0, user_utils_1.generateStudentId)(academicSemester);
        user.id = studentId;
        student.id = studentId;
        //  CREATING STUDENT USING SESSION
        const newStudent = yield student_model_1.Student.create([student], { session });
        if (!newStudent.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create student');
        }
        //  SET STUDENT _id (reference) TO user.student
        user.student = newStudent[0]._id;
        //  CREATING USER
        const newUser = yield user_model_1.User.create([user], { session });
        if (!newUser.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create student');
        }
        newUserData = newUser[0];
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
    if (newUserData) {
        newUserData = yield user_model_1.User.findOne({ id: newUserData.id }).populate({
            path: 'student',
            populate: [
                {
                    path: 'academicSemester',
                },
                {
                    path: 'academicDepartment',
                },
                {
                    path: 'academicFaculty',
                },
            ],
        });
    }
    // PUBLISH ON REDIS
    if (newUserData) {
        yield redis_1.RedisClient.publish(user_constant_1.EVENT_STUDENT_CREATED, JSON.stringify(newUserData.student));
    }
    return newUserData;
});
// Create Faculty
const createFaculty = (faculty, user) => __awaiter(void 0, void 0, void 0, function* () {
    // SET ROLE
    user.role = user_1.ENUM_USER_ROLE.FACULTY;
    // IF PASSWORD IS NOT GIVEN, SET DEFAULT PASSWORD
    if (!user.password) {
        user.password = index_1.default.default_faculty_pass;
    }
    let newUserData = null;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // AUTO GENERATED INCREMENTAL FACULTY ID
        const facultyId = yield (0, user_utils_1.generateFacultyId)();
        user.id = facultyId;
        faculty.id = facultyId;
        //  CREATING FACULTY
        const newFaculty = yield faculty_model_1.Faculty.create([faculty], { session });
        if (!newFaculty.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create faculty');
        }
        //  SET Faculty _id (reference) TO user.faculty
        user.faculty = newFaculty[0]._id;
        //  CREATING USER
        const newUser = yield user_model_1.User.create([user], { session });
        if (!newUser.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create faculty');
        }
        newUserData = newUser[0];
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
    if (newUserData) {
        newUserData = yield user_model_1.User.findOne({ id: newUserData.id }).populate({
            path: 'faculty',
            populate: [
                {
                    path: 'academicDepartment',
                },
                {
                    path: 'academicFaculty',
                },
            ],
        });
    }
    // PUBLISH ON REDIS
    if (newUserData) {
        yield redis_1.RedisClient.publish(user_constant_1.EVENT_FACULTY_CREATED, JSON.stringify(newUserData.faculty));
    }
    return newUserData;
});
// Create Admin
const createAdmin = (admin, user) => __awaiter(void 0, void 0, void 0, function* () {
    // SET ROLE
    user.role = user_1.ENUM_USER_ROLE.ADMIN;
    // IF PASSWORD IS NOT GIVEN, SET DEFAULT PASSWORD
    if (!user.password) {
        user.password = index_1.default.default_admin_pass;
    }
    // generate faculty id
    let newUserAllData = null;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // AUTO GENERATED INCREMENTAL ADMIN ID
        const adminId = yield (0, user_utils_1.generateAdminId)();
        user.id = adminId;
        admin.id = adminId;
        //  CREATING ADMIN USING SESSION
        const newAdmin = yield admin_model_1.Admin.create([admin], { session });
        if (!newAdmin.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create Admin ');
        }
        //  SET ADMIN _id (reference) TO user.admin
        user.admin = newAdmin[0]._id;
        //  CREATING USER
        const newUser = yield user_model_1.User.create([user], { session });
        if (!newUser.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create admin');
        }
        newUserAllData = newUser[0];
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
    if (newUserAllData) {
        newUserAllData = yield user_model_1.User.findOne({ id: newUserAllData.id }).populate({
            path: 'admin',
            populate: [
                {
                    path: 'managementDepartment',
                },
            ],
        });
    }
    // PUBLISH ON REDIS
    if (newUserAllData) {
        yield redis_1.RedisClient.publish(user_constant_1.EVENT_ADMIN_CREATED, JSON.stringify(newUserAllData.admin));
    }
    return newUserAllData;
});
// GET ALL USERS
const getAllUsers = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
    // search and filters condition
    const andConditions = [];
    // ❌ Always exclude SUPER_ADMIN
    andConditions.push({
        role: { $ne: user_1.ENUM_USER_ROLE.SUPER_ADMIN },
    });
    // search condition $or
    if (searchTerm) {
        andConditions.push({
            $or: user_constant_1.userSearchableFields.map((field) => ({
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
    // QUERY
    const result = yield user_model_1.User.find(whereCondition)
        .populate('admin')
        .populate('faculty')
        .populate('student');
    // RETURNING RESPONSE
    return {
        meta: {
            page,
            limit,
            total: result.length,
        },
        data: result,
    };
});
// GET SINGLE USER
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findOne({ id: id })
        .populate('admin')
        .populate('faculty')
        .populate('student');
    return result;
});
// UPDATE USER
const updateUser = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // GET USER
    const getUser = yield user_model_1.User.findOne({ id: id });
    // CHECK USER
    if (!getUser) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // UPDATE SUPER ADMIN
    if (getUser.role === user_1.ENUM_USER_ROLE.SUPER_ADMIN) {
        //
        return getUser;
    }
    else if (getUser.role === user_1.ENUM_USER_ROLE.ADMIN) {
        // UPDATE ADMIN
        const result = yield admin_model_1.Admin.findOneAndUpdate({ id: getUser.id }, payload, {
            new: true,
        }).populate('admin');
        return result;
    }
    else if (getUser.role === user_1.ENUM_USER_ROLE.FACULTY) {
        // UPDATE FACULTY
        const result = yield faculty_model_1.Faculty.findOneAndUpdate({ id: getUser.id }, payload, {
            new: true,
        }).populate('faculty');
        return result;
    }
    else if (getUser.role === user_1.ENUM_USER_ROLE.STUDENT) {
        // UPDATE STUDENT
        const result = yield student_model_1.Student.findOneAndUpdate({ id: getUser.id }, payload, {
            new: true,
        }).populate('student');
        return result;
    }
    return null;
});
// DELETE USER
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the user
    const user = yield user_model_1.User.findOne({ id })
        .populate('admin')
        .populate('faculty')
        .populate('student');
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // Delete related role data
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        if (user.admin) {
            yield admin_model_1.Admin.findByIdAndDelete(user.admin.id, { session });
        }
        if (user.faculty) {
            yield faculty_model_1.Faculty.findByIdAndDelete(user.faculty.id, { session });
        }
        if (user.student) {
            yield student_model_1.Student.findByIdAndDelete(user.student.id, { session });
        }
        // Delete the user itself
        const deletedUser = yield user_model_1.User.findByIdAndDelete(user._id, { session });
        yield session.commitTransaction();
        return deletedUser;
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
// EXPORT USER SERVICES
exports.UserService = {
    createStudent,
    createFaculty,
    createAdmin,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
};
