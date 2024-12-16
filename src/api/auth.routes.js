import express from "express";
import { AuthenticationController } from "../services/authentication/authentication.controller.js";
import { authenticate } from "../middlewares/authentication.middleware.js";

const router = express.Router();
const controller = new AuthenticationController();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *      - Authentication
 *     description: Register user
 *     parameters:
 *         - in: body
 *           name: body
 *           schema:
 *              type: object
 *              properties:
 *                  username:
 *                      type: string
 *                      required: true
 *                  email:
 *                      type: string
 *                      required: true
 *                  password:
 *                      type: string
 *                      required: true
 *     responses:
 *       '200':
 *         description: Returns a success message with email and id of new user.
 */
router.post("/register", controller.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *      - Authentication
 *     description: get access token by user credentials
 *     parameters:
 *         - in: body
 *           name: body
 *           schema:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                      required: true
 *                  password:
 *                      type: string
 *                      required: true
 *     responses:
 *       '200':
 *         description: Returns an access token for the user
 */
router.post("/login", controller.login);

router.use(authenticate);
/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     tags:
 *      - Authentication
 *     description: get access token by user refresh-token
 *     responses:
 *       '200':
 *         description: Returns an access token for the user
 */
router.post("/refresh-token", controller.refreshAccessToken);

export default router;
