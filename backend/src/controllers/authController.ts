import { Request, Response, NextFunction } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { StringValue } from "ms";
import { UserDocument, IUser } from "../interfaces/IUser";
import CustomError from "../utils/CustomError";
import ICustomRequest from "../interfaces/ICustomRequest";
import { promisify } from "util";

function signToken(id: unknown) {
  const expiresIn: StringValue = (process.env.JWT_EXPIRES_IN as StringValue) || "30d";
  if (!process.env.JWT_SECRET_STR)
    throw new Error("JWT_SECRET_STR environment variable isn't set.");
  return jwt.sign({ id }, process.env.JWT_SECRET_STR, { expiresIn });
}

function sendResponse(statusCode: number, user: IUser, res: Response) {
  const token = signToken(user._id);
  (user as any).password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
}

export const signup = asyncErrorHandler(async function (
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const user: IUser = await User.create(req.body);
  sendResponse(201, user, res);
});

export const login = asyncErrorHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) next(new CustomError("please enter your username & password", 400));
  const user: UserDocument = await User.findOne({ username }).select("+password");
  if (!user) next(new CustomError("incorrect username", 400));
  const correctPassword = await user.checkPassword(password, user.password);
  if (!correctPassword) return next(new CustomError("incorrect password", 400));
  sendResponse(200, user, res);
});

export const protect = asyncErrorHandler(async function (
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  let token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer"))
    return next(new CustomError("You are not logged in.", 401));
  token = token.split(" ")[1];
  if (!process.env.JWT_SECRET_STR)
    throw new Error("JWT_SECRET_STR environment variable isn't set.");
  const decoded = await promisify<string, jwt.Secret>(jwt.verify)(
    token,
    process.env.JWT_SECRET_STR,
  );
  interface DecodedToken extends jwt.JwtPayload {
    id: string;
    iat: number;
    exp: number;
  }
  const decodedToken = decoded as any as DecodedToken;
  const user: UserDocument | null = await User.findById(decodedToken.id);
  if (!user) return next(new CustomError("the user with the given token doesn't exist", 401));
  if (user.isPasswordChanged(decodedToken.iat))
    return next(new CustomError("the password was changed recently, please login again.", 401));
  (req as ICustomRequest).user = user;
  next();
});
