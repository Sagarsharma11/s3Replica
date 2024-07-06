import express from "express";
import cors from "cors";
import swaggerDocument from "../swagger.json" assert { type: "json" };

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);
app.use(express.static("public"));

app.get("/", (_, res) => {
  res.status(200).json({ message: "home" });
});

// router import
import bucketRoutes from "./routes/bucket.route.js";
import fileRoutes from "./routes/file.route.js";
import swaggerUi from "swagger-ui-express";
import userRoutes from "./routes/user.route.js";

// router declaration
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/buckets", bucketRoutes);
app.use("/files", fileRoutes);
app.use('/users', userRoutes);

export { app };