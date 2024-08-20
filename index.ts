import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import apiRouter from "src/routes/api.router";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI!);

app.use("/api/", apiRouter);

app.all("*", function (req, res) {
  return res.status(400).send("Build with ❤ by Fadhil Amadan");
});

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}/api`),
);
