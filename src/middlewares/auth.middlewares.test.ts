import { NextFunction, Request, Response } from "express";

import { verifyToken } from "src/utils/jwt";
import { authenticateJWT } from "./auth.middlewares";

jest.mock("src/utils/jwt");

describe("Auth", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let req: Partial<Request | any>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      header: jest.fn(),
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as Partial<Response>;

    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call next if token is valid", () => {
    const token = "valid-token";
    const mockUser = { id: "1", name: "Fadhil Amadan" };

    (req.header as jest.Mock).mockReturnValue(`Bearer ${token}`);
    (verifyToken as jest.Mock).mockReturnValue(mockUser);
    authenticateJWT(req as Request, res as Response, next);

    expect(req.header).toHaveBeenCalledWith("Authorization");
    expect(verifyToken).toHaveBeenCalledWith(token);
    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalled();
  });

  it("should return 401 if no token is provided", () => {
    authenticateJWT(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Access Denied: No Token Provided!",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if token is invalid", () => {
    const token = "invalid-token";

    (req.header as jest.Mock).mockReturnValue(`Bearer ${token}`);
    (verifyToken as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid Token");
    });
    authenticateJWT(req as Request, res as Response, next);

    expect(verifyToken).toHaveBeenCalledWith(token);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Access Denied: Invalid Token!",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
