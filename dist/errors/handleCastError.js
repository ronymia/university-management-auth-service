"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const handleCastError = (error) => {
    const errors = [
        {
            path: error.path,
            message: `Invalid id - ${error.value}`,
        },
    ];
    return {
        statusCode: http_status_1.default.NOT_ACCEPTABLE,
        message: 'Cast Error',
        errorMessages: errors,
    };
};
exports.default = handleCastError;
