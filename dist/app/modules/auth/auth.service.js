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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const user_model_1 = require("../user/user.model");
const config_1 = __importDefault(require("../../../config"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const http_status_1 = __importDefault(require("http-status"));
const admin_model_1 = require("../admin/admin.model");
const faculty_model_1 = require("../faculty/faculty.model");
const student_model_1 = require("../student/student.model");
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new user_model_1.User();
    const { id, password } = payload;
    const isUserExist = yield user.isUserExist(id);
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, ' User not found');
    }
    // check password
    const isPasswordMatch = isUserExist.password &&
        (yield user.isPasswordMatch(password, isUserExist.password));
    if (!isPasswordMatch) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, ' Password incorrect');
    }
    let getUserData = null;
    if (isUserExist.role === 'admin') {
        getUserData = yield admin_model_1.Admin.findOne({ id: isUserExist.id }).populate('managementDepartment');
    }
    else if (isUserExist.role === 'faculty') {
        getUserData = yield faculty_model_1.Faculty.findOne({ id: isUserExist.id })
            .populate('academicDepartment')
            .populate('academicFaculty');
    }
    else if (isUserExist.role === 'student') {
        getUserData = yield student_model_1.Student.findOne({ id: isUserExist.id })
            .populate('academicSemester')
            .populate('academicDepartment')
            .populate('academicFaculty');
    }
    // create JWT token and refresh token
    const { id: userId, role, needsChangePassword } = isUserExist;
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ userId, role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ userId, role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
        needsChangePassword,
        user: getUserData,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // Invalid token - synchronous
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
    }
    catch (err) {
        // Log the error for debugging purposes
        // Differentiate between token expiration and other errors
        if (err.name === 'TokenExpiredError') {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'JWT token has expired');
        }
        else if (err.name === 'JsonWebTokenError') {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid JWT token');
        }
        else {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Could not verify JWT token');
        }
    }
    const { userId } = verifiedToken;
    const user = new user_model_1.User();
    const isUserExist = yield user.isUserExist(userId);
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, ' User not found');
    }
    //generate new token
    const newAccessToken = jwtHelpers_1.jwtHelpers.createToken({
        id: isUserExist.id,
        role: isUserExist.role,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        accessToken: newAccessToken,
    };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = payload;
    // // checking is user exist
    // const isUserExist = await User.isUserExist(user?.userId);
    //alternative way
    const isUserExist = yield user_model_1.User.findOne({ id: user === null || user === void 0 ? void 0 : user.userId }).select('+password');
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    // checking old password
    const userExist = new user_model_1.User();
    if (isUserExist.password &&
        !(yield userExist.isPasswordMatch(oldPassword, isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Old Password is incorrect');
    }
    // // hash password before saving
    // const newHashedPassword = await bcrypt.hash(
    //   newPassword,
    //   Number(config.bycrypt_salt_rounds)
    // );
    // const query = { id: user?.userId };
    // const updatedData = {
    //   password: newHashedPassword,  //
    //   needsPasswordChange: false,
    //   passwordChangedAt: new Date(), //
    // };
    // await User.findOneAndUpdate(query, updatedData);
    // data update
    isUserExist.password = newPassword;
    isUserExist.needsChangePassword = false;
    // updating using save()
    isUserExist.save();
});
exports.AuthService = {
    loginUser,
    refreshToken,
    changePassword,
};
