import { AuthenticationService } from "./authentication.service.js";

export class AuthenticationController {
  static instance = null;
  constructor() {
    if (AuthenticationController.instance) {
      console.log("AuthenticationController instance already exists");
      return AuthenticationController.instance;
    }
    this.Service = new AuthenticationService();
    AuthenticationController.instance = this;
  }

  register = async (req, res) => {
    try {
      const userId = await this.Service.register(req.body);
      res.status(201).json(userId);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.errors?.[0]?.message || err.message });
    }
  };

  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const { token, refreshToken } = await this.Service.login(email, password);

      res.json({ token, refreshToken });
    } catch (err) {
      console.error(err);
      let errorCode = 500;
      if (err.message == "User not found") errorCode = 404;
      else if (err.message == "Invalid credentials") errorCode = 401;
      res.status(errorCode).json({ error: err.message });
    }
  };

  refreshAccessToken = async (req, res) => {
    try {
      const refreshToken = req.headers["authorization"]?.split(" ")[1];

      const token = await this.Service.refreshAccessToken(refreshToken);
      res.json({ token });
    } catch (err) {
      let errorCode = 500;
      if (err.message == "jwt malformed") errorCode = 401;
      res.status(errorCode).json({ error: err.message });
    }
  };
}
