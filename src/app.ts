import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { databaseInitialConfig } from "./initial";
import path from "path";
require("dotenv").config({
  path: path.resolve(
    process.cwd(),
    `.env.${process.env.NODE_ENV || "development"}`
  ),
  override: true,
});
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import { consume } from "./messages/consumer";

databaseInitialConfig();

const port = process.env.PORT || 3000;

const app: Application = express();

const specs = swaggerJsdoc(require("../static/swagger.json"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors());

import auth from "./routes/auth.route";
import user from "./routes/user.route";
import task from "./routes/task.route";
app.use("/auth", auth);
app.use("/users", user);
app.use("/tasks", task);

app.use("/", (req: Request, res: Response, next: NextFunction): void => {
  res.json({ message: "Allo! Catch-all route." });
});



consume().catch((err) => console.error('Consumer error: ' + err))

app.listen(port, () => {
  console.log("Server listening on port 3000");
});


export default app;
