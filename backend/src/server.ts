import "./utils/uncaughtExceptionHandler";
import mongoose from "mongoose";
import app from "./app";

if (!process.env.MONGODB_URL) throw Error("MONGODB_URL environment variable isn't set");

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("connected to mongodb server!"))
  .catch((err) => console.log("something went wrong while connecting to mongodb server: ", err));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log("server has started..."));

process.on("unhandledRejection", (err: Error) => {
  console.log(err.name, err.message);
  console.log("unhandledRejection occured! shutting down...");
  server.close(() => process.exit(1));
});
