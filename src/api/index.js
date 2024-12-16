import express from "express";
import authRoutes from "./auth.routes.js";
import noteRoutes from "./note.routes.js";
import swaggerRoute from "./docs.routes.js";
import { authenticate } from "../middlewares/authentication.middleware.js";

const router = express.Router();

router.use("/docs", swaggerRoute);
router.use("/auth", authRoutes);

router.use(authenticate);
router.use("/notes", noteRoutes);

export default router;
