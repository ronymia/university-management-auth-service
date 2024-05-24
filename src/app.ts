import express, { Application } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import { Routes } from './app/routes/index';
const app: Application = express();

// using cors
app.use(cors());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Application routes
app.use('/api/v1/', Routes);

//Testing
// app.get('/', async (req: Request, res: Response) => {
//     Promise.reject(new Error('unhandled request'));
// });

//global error handler
app.use(globalErrorHandler);

export default app;
