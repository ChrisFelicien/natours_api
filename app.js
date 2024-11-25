import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import xss from "xss-clean";
import ErrorConstructor from "./utils/Errors.js";
import globalError from "./controllers/globalErrorHandler.js";
import toursRoutes from "./routes/toursRoute.js";
import usersRoute from "./routes/usersRoutes.js";
import morgan from "morgan";

const app = express();

app.use(helmet());
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(express.json({ limit: "10kb" }));

app.use(mongoSanitize());
app.use(xss());

const limiter = rateLimit({
  max: 300,
  windowMs: 60 * 60 * 1000,
  message: "Too many request please try again later."
});

app.use(
  hpp({
    whitelist: ["duration"]
  })
);

app.use("/api", limiter);
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
