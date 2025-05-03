process.on("uncaughtException", (err: Error) => {
  console.log(err.name, err.message);
  console.log("uncaughtException occured! shutting down...");
  process.exit(1);
});
