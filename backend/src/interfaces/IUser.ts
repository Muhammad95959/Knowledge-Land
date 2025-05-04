import { Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  confirmPassword?: string;
  active: boolean;
  passwordChangedAt: Date;
}

export interface IUserMethods {
  checkPassword(pass: string, dbPass: string): Promise<boolean>;
  isPasswordChanged(loginTime: number): boolean;
}

export type UserDocument = IUser & IUserMethods;
