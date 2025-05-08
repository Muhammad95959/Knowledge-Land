import { Query } from "mongoose";
import CustomError from "./CustomError";
import Question from "../models/questionModel";

export default class ApiFeatures {
  query: Query<any, any>;
  queryStr: Record<string, any>;
  constructor(query: Query<any, any>, queryStr: Record<string, any>) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const excludedFields = ["sort", "limit", "page", "fields"];
    const queryObj = { ...this.queryStr };
    excludedFields.forEach((val) => delete queryObj[val]);
    this.query = this.query.find(queryObj);
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy: string = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("owner collectionName");
    }
    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  async paginate() {
    const limit = this.queryStr.limit || 20;
    const page = this.queryStr.page || 1;
    const skip = limit * (page - 1);
    if (this.queryStr.page) {
      const questionsCount = await Question.countDocuments();
      if (skip >= questionsCount) throw new CustomError("this page is not found", 404);
    }
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
