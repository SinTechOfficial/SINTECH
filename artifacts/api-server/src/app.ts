import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.set("trust proxy", 1);
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(helmet());
const configuredSiteOrigin = process.env["SITE_ORIGIN"];
const deployedOrigins = (process.env["REPLIT_DOMAINS"] ?? "")
  .split(",")
  .map((domain) => domain.trim())
  .filter(Boolean)
  .map((domain) => {
    try {
      return new URL(domain.includes("://") ? domain : `https://${domain}`).origin;
    } catch {
      return "";
    }
  })
  .filter(Boolean);
const allowedOrigins = new Set([
  ...deployedOrigins,
  ...(configuredSiteOrigin
    ? [new URL(configuredSiteOrigin).origin]
    : []),
]);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, false);
      if (
        process.env["NODE_ENV"] !== "production" &&
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      ) {
        return callback(null, origin);
      }
      if (allowedOrigins.has(origin)) return callback(null, origin);
      return callback(new Error("Origin not allowed."));
    },
    credentials: false,
  }),
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: false, limit: "16kb" }));

app.use("/api", router);
app.use(
  (
    error: unknown,
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    const status =
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof error.status === "number"
        ? error.status
        : 500;
    if (status >= 500) req.log.error("API request failed.");
    return res.status(status).json({
      message:
        status === 413
          ? "Request is too large."
          : status === 400
            ? "Invalid request."
            : status === 403
              ? "Origin not allowed."
              : "An unexpected error occurred.",
    });
  },
);

export default app;
