import express from "express";
import routes from "./src/api/index.js";
import { SequelizeConnection } from "./src/database/connection.js";
import RedisClient from "./src/services/redisClient/redisClient.service.js";
import { isDev } from "./src/configs.js";
import expressFileUpload from "express-fileupload";

const app = express();
// disable x-powered-by for security reasons
app.disable("x-powered-by");
app.use(
  // Middleware for body parsing (optional for other types of body data)
  express.json({}), // For JSON requests
  express.urlencoded({ extended: true }), // For URL-encoded data

  expressFileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    abortOnLimit: true,
  })
);

// Routes
app.use("/api", routes);
app.use("*", (req, res) => res.redirect("/api/docs"));

app.use((err, req, res, next) => {
  if (err instanceof PayloadTooLargeError) {
    res.status(400).send("File size exceeds the limit!");
  } else {
    next(err);
  }
});

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    // Initialize Database
    await new SequelizeConnection().connection.authenticate();
    isDev && (await new SequelizeConnection().connection.sync());
    console.log("Database connected!");

    // Initialize Redis
    await new RedisClient().client.connect();

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
})();
