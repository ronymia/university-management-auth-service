"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLogger = exports.logger = void 0;
const path_1 = __importDefault(require("path"));
const winston_1 = require("winston");
require("winston-daily-rotate-file");
const { combine, timestamp, label, printf } = winston_1.format;
const loggerFormat = printf(({ level, message, label, timestamp }) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${date.toDateString()} ${hours}:${minutes}:${seconds} } [${label}] ${level}: ${message}`;
});
const logger = (0, winston_1.createLogger)({
    level: 'info',
    format: combine(label({ label: 'PH' }), timestamp(), loggerFormat),
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.DailyRotateFile({
            level: 'info',
            filename: path_1.default.join(process.cwd(), 'logs', 'winston', 'successes', '%DATE%success.log'),
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '1d',
        }),
    ],
});
exports.logger = logger;
const errorLogger = (0, winston_1.createLogger)({
    level: 'error',
    format: combine(label({ label: 'PH' }), timestamp(), loggerFormat),
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.DailyRotateFile({
            level: 'error',
            filename: path_1.default.join(process.cwd(), 'logs', 'winston', 'errors', '%DATE%error.log'),
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '1d',
        }),
    ],
});
exports.errorLogger = errorLogger;
