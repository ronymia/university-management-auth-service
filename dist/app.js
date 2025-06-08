"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const index_1 = require("./app/routes/index");
const http_status_1 = __importDefault(require("http-status"));
const app = (0, express_1.default)();
// using cors
app.use((0, cors_1.default)({ origin: '*', credentials: true }));
//parser
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Application routes
app.use('/api/v1/', index_1.Routes);
//Testing
// app.get('/', async (req: Request, res: Response) => {
//     Promise.reject(new Error('unhandled request'));
// });
//global error handler
app.use(globalErrorHandler_1.default);
// handle not found route
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: 'Route not found',
        errorMessages: [{ path: req.originalUrl, message: 'Api not found' }],
        stack: undefined,
    });
    next();
});
exports.default = app;
