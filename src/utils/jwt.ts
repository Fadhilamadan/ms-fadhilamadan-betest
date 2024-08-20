import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_DURATION = process.env.JWT_DURATION || "2h";

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_DURATION });
};

export const verifyToken = (token: string): JwtPayload | string => {
  try {
    return jwt.verify(token, JWT_SECRET);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    throw new Error("Access Denied: Invalid Token!");
  }
};
