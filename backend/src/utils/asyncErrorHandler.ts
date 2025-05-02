import { Request, Response, NextFunction } from "express";

type AsyncMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any>;

export default function asyncErrorHandler(fun: AsyncMiddleware) {
  return (req: Request, res: Response, next: NextFunction) => {
    fun(req, res, next).catch((err) => next(err));
  };
}
