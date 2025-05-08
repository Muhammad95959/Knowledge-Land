import { Request, Response, NextFunction } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import Question from "../models/questionModel";
import ICustomRequest from "../interfaces/ICustomRequest";
import CustomError from "../utils/CustomError";
import ApiFeatures from "../utils/ApiFeatures";

export const getAllQuestions = asyncErrorHandler(async function (
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const features = await new ApiFeatures(Question.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const questions = await features.query;
  res.status(200).json({
    status: "success",
    count: questions.length,
    data: {
      questions,
    },
  });
});

export const createQuestion = asyncErrorHandler(async function (
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const question = await Question.create({
    owner: (req as ICustomRequest).user.username,
    ...req.body,
  });
  res.status(201).json({
    status: "success",
    data: {
      question,
    },
  });
});

export const getQuestion = asyncErrorHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const question = await Question.findById(req.params.id);
  if (!question) return next(new CustomError("The question doesn't exist", 404));
  res.status(200).json({
    status: "success",
    data: {
      question,
    },
  });
});

export const updateQuestion = asyncErrorHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!question) return next(new CustomError("The question doesn't exist", 404));
  res.status(201).json({
    status: "success",
    data: {
      question,
    },
  });
});

export const deleteQuestion = asyncErrorHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const question = await Question.findByIdAndDelete(req.params.id);
  if (!question) return next(new CustomError("The question doesn't exist", 404));
  res.status(204).end();
});
