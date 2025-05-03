import { Request, Response, NextFunction } from "express";
import ICustomError from "../interfaces/ICustomError";

function devError(error: ICustomError, res: Response) {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stacktrace: error.stack,
    error: error,
  });
}

function prodError(error: ICustomError, res: Response) {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "something went wrong! please try again later.",
    });
  }
}

export default function globalErrorHandler(
  error: ICustomError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  if (process.env.NODE_ENV === "development") devError(error, res);
  else if (process.env.NODE_ENV === "production") {
    prodError(error, res);
  }
}
