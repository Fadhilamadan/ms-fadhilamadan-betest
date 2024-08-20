import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

import { verifyToken } from "src/utils/jwt";

interface AuthenticatedRequest extends Request {
  user?: JwtPayload | string;
}

export const authenticateJWT = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No Token Provided!" });
  }

  try {
    req.user = verifyToken(token);
    next();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    res.status(400).json({ message: "Access Denied: Invalid Token!" });
  }
};
