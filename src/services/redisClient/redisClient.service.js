import { createClient } from "redis";
import { REDIS_PASSWORD, REDIS_URL } from "../../configs.js";

export default class RedisClient {
  static instance;
  client;

  constructor() {
    if (RedisClient.instance) return RedisClient.instance;

    this.client = createClient({
      url: REDIS_URL || "redis://localhost:6379",
      password: REDIS_PASSWORD, // Load password from env
    });

    this.client.on("error", (err) => console.error("Redis Client Error", err));
    this.client.on("connect", () => console.error("Redis Client Connected!"));

    RedisClient.instance = this;
  }
}
