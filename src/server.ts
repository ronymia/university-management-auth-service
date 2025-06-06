/* eslint-disable no-unused-expressions */
import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './config/index';
import { errorLogger, logger } from './shared/logger';
import { RedisClient } from './shared/redis';
import subscribeToEvents from './app/events';
import seedDB from './app/DB';

process.on('uncaughtException', (error) => {
    errorLogger.error(error);
    process.exit(1);
});

let server: Server;

async function DbConnect() {
    try {
        // REDIS CONNECT
        await RedisClient.connect().then(async () => {
            subscribeToEvents();
        });

        // DATABASE CONNECT
        await mongoose.connect(config.database_url as string).then(async () => {
            await seedDB();
            logger.info(`🛢   Database is connected successfully`);
        });

        // SERVER
        server = app.listen(config.port, () => {
            logger.info(`Application  listening on port ${config.port}`);
        });
    } catch (err) {
        errorLogger.error('Failed to connect database', err);
    }

    process.on('unhandledRejection', (error) => {
        if (server) {
            server.close(() => {
                errorLogger.error(error);
                process.exit(1);
            });
        } else {
            process.exit(1);
        }
    });
}

DbConnect();

process.on('SIGTERM', () => {
    logger.info('SIGTERM is received');
    if (server) {
        server.close();
    }
});
