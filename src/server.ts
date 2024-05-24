import mongoose from 'mongoose';
import config from './config/index';
import app from './app';
import { logger, errorLogger } from './shared/logger';
import { Server } from 'http';

async function dbConnect() {
    let server: Server;
    try {
        await mongoose.connect(config.database_url as string);
        logger.info(`🛢   Database is connected successfully`);

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

dbConnect();
