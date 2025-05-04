import { Request } from "express";
import { UserDocument } from "./IUser";

export default interface ICustomRequest extends Request {
  user: UserDocument;
}
