import express from "express";
import ErrorConstructor from "./utils/Errors.js";
import globalError from "./controllers/globalErrorHandler.js";
import toursRoutes from "./routes/toursRoute.js";
import usersRoute from "./routes/usersRoutes.js";
import morgan from "morgan";

const app = express();

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
// Define routes

app.use("/api/v1/tours", toursRoutes);
app.use("/api/v1/users", usersRoute);

app.all("*", (req, res, next) => {
  next(
    new ErrorConstructor(
      `Sorry this routes ${req.originalUrl} not defined in this server`,
      404
    )
  );
});
app.use(globalError);

export default app;
