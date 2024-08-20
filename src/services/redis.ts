import { createClient } from "redis";

const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT as string),
  },
});

redisClient.on("error", (err) => console.error("Redis Error: ", err));
redisClient.connect();

export const setCache = async (key: string, value: object, ttl: number) => {
  try {
    await redisClient.set(key, JSON.stringify(value), { EX: ttl });
  } catch (err) {
    console.error("Redis", err);
  }
};

export const getCache = async (key: string) => {
  try {
    const cachedData = await redisClient.get(key);
    return cachedData ? JSON.parse(cachedData) : null;
  } catch (err) {
    console.error("Redis", err);
    return null;
  }
};
