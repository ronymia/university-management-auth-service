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
Object.defineProperty(exports, "__esModule", { value: true });
exports.startOutboxPoller = void 0;
const logger_1 = require("../../shared/logger");
const redis_1 = require("../../shared/redis");
const outbox_model_1 = require("../modules/outbox/outbox.model");
const POLLING_INTERVAL_MS = 5000;
const startOutboxPoller = () => {
    logger_1.logger.info('Started Outbox Poller for reliable event publishing...');
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Find all pending events
            const pendingEvents = yield outbox_model_1.Outbox.find({ status: 'PENDING' });
            if (pendingEvents.length === 0)
                return;
            // Attempt to publish each event to Redis
            for (const event of pendingEvents) {
                try {
                    yield redis_1.RedisClient.publish(event.eventType, event.payload);
                    // Mark as published
                    event.status = 'PUBLISHED';
                    yield event.save();
                    logger_1.logger.info(`Successfully published outbox event: ${event.eventType}`);
                }
                catch (publishError) {
                    logger_1.errorLogger.error(`Failed to publish event ${event.eventType}, will retry next cycle`, publishError);
                }
            }
        }
        catch (error) {
            logger_1.errorLogger.error('Outbox Poller encountered a database error:', error);
        }
    }), POLLING_INTERVAL_MS);
};
exports.startOutboxPoller = startOutboxPoller;
