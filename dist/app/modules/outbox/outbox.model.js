"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Outbox = void 0;
const mongoose_1 = require("mongoose");
const OutboxSchema = new mongoose_1.Schema({
    eventType: {
        type: String,
        required: true,
    },
    payload: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['PENDING', 'PUBLISHED'],
        default: 'PENDING',
    },
}, {
    timestamps: true,
});
exports.Outbox = (0, mongoose_1.model)('Outbox', OutboxSchema);
