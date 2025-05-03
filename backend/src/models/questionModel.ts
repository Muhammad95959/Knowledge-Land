import mongoose from "mongoose";
import IQuestion from "../interfaces/IQuestion";

const schema = new mongoose.Schema({
  owner: {
    type: String,
  },
  collectionName: {
    type: String,
    required: [true, "the questions collection is missing."],
  },
  question: {
    type: String,
    required: [true, "the question is missing."],
  },
  choices: {
    type: [String],
    required: [true, "the choices are missing."],
    validate: [
      {
        validator: (val: string[]) => val.length > 1,
        message: "you must provide at least two choices.",
      },
      {
        validator: (val: string[]) => new Set(val).size === val.length,
        message: "choices must be unique.",
      },
    ],
  },
  correctAnswer: {
    type: String,
    required: [true, "the correct answer is missing."],
    validate: {
      validator: function (this: IQuestion, val: string) {
        return this.choices.includes(val);
      },
      message: "the provided correct answer isn't one of the choices.",
    },
  },
});

const Question = mongoose.model("Question", schema);
export default Question;
