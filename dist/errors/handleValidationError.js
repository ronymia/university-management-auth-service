"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const handleValidationError = (err) => {
    const error = Object.values(err === null || err === void 0 ? void 0 : err.errors).map((element) => {
        return {
            path: element === null || element === void 0 ? void 0 : element.path,
            message: element === null || element === void 0 ? void 0 : element.message,
        };
    });
    const statusCode = http_status_1.default.UNPROCESSABLE_ENTITY;
    return {
        statusCode,
        message: 'Validation error',
        errorMessages: error,
    };
};
exports.default = handleValidationError;
