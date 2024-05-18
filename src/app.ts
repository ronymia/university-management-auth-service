import express, { Application, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";

const app: Application = express();

// using cors
app.use(cors());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// All imported routes
import { UserRoutes } from "./app/modules/user/user.route";
// Application routes
app.use("/api/v1/users/", UserRoutes);

//Testing
app.get("/", async (req: Request, res: Response) => {
  Promise.reject(new Error("unhandled request"));
});

//global error handler
app.use(globalErrorHandler);

export default app;
