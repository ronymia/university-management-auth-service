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
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const index_1 = __importDefault(require("./config/index"));
const logger_1 = require("./shared/logger");
const redis_1 = require("./shared/redis");
const events_1 = __importDefault(require("./app/events"));
const DB_1 = __importDefault(require("./app/DB"));
process.on('uncaughtException', (error) => {
    logger_1.errorLogger.error(error);
    process.exit(1);
});
let server;
function DbConnect() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // REDIS CONNECT
            yield redis_1.RedisClient.connect().then(() => __awaiter(this, void 0, void 0, function* () {
                (0, events_1.default)();
            }));
            // DATABASE CONNECT
            yield mongoose_1.default.connect(index_1.default.database_url).then(() => __awaiter(this, void 0, void 0, function* () {
                yield (0, DB_1.default)();
                logger_1.logger.info(`🛢   Database is connected successfully`);
            }));
            // SERVER
            server = app_1.default.listen(index_1.default.port, () => {
                logger_1.logger.info(`Application  listening on port ${index_1.default.port}`);
            });
        }
        catch (err) {
            logger_1.errorLogger.error('Failed to connect database', err);
        }
        process.on('unhandledRejection', (error) => {
            if (server) {
                server.close(() => {
                    logger_1.errorLogger.error(error);
                    process.exit(1);
                });
            }
            else {
                process.exit(1);
            }
        });
    });
}
DbConnect();
process.on('SIGTERM', () => {
    logger_1.logger.info('SIGTERM is received');
    if (server) {
        server.close();
    }
});
