import { AuthenticationService } from "../services/authentication/authentication.service";
import { verifyAccessToken, verifyRefreshToken } from "../utils/jwt.js";

export async function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];

    // check if the path is for refresh token
    const isForRefreshToken = req.path.endsWith("/refresh-token");
    const { id } = isForRefreshToken
      ? verifyRefreshToken(token)
      : verifyAccessToken(token);
    console.log({ isForRefreshToken, id });
    req.user = await new AuthenticationService().getById(id);
    if (!id || !req.user) throw new Error("Unauthorized");

    req.userId = id;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Unauthorized" });
  }
}
