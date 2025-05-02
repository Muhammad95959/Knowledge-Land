import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import sanitize from "express-mongo-sanitize";
import hpp from "hpp";
import globalErrorHandler from "./controllers/errorController";
import CustomError from "./utils/CustomError";

const app = express();
app.use(helmet());
app.use(express.json());
app.use(sanitize());
app.use(hpp());
app.all("*", routesErrorsHandler);
app.use(globalErrorHandler);

function routesErrorsHandler(req: Request, _res: Response, next: NextFunction) {
  next(new CustomError(`cann't find ${req.originalUrl} on the server!`, 404));
}

export default app;
