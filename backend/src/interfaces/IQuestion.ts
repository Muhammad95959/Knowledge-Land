import { Document } from "mongoose";

export default interface IQuestion extends Document {
  owner: string;
  collectionName: string;
  question: string;
  choices: string[];
  correctAnswer: string;
}
