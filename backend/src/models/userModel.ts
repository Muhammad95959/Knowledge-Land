import mongoose from "mongoose";
import { UserDocument } from "../interfaces/IUser";
import bcrypt from "bcryptjs";

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "please enter your username."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "please enter your password."],
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "please confirm your password."],
    select: false,
    validate: {
      validator: function (this: UserDocument, val: string) {
        return val === this.password;
      },
      message: "password & confirm password doesn't match!",
    },
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now()
  },
});

schema.pre("save", async function (this: UserDocument, next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
  }
  next();
});

schema.methods.checkPassword = async function (pass: string, dbPass: string) {
  return await bcrypt.compare(pass, dbPass);
};

schema.methods.isPasswordChanged = function (this: UserDocument, loginTimestamp: number) {
  const passwordChangedAtTimestamp = parseInt((this.passwordChangedAt.getTime() / 1000).toString());
  return passwordChangedAtTimestamp > loginTimestamp;
};

const User = mongoose.model("User", schema);
export default User;
