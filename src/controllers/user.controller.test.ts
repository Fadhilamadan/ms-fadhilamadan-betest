import { Request, Response } from "express";

import { User } from "src/models/user.model";
import { getCache, setCache } from "src/services/redis";
import {
  createUser,
  getUserByAccountNumber,
  getUserByRegistrationNumber,
} from "./user.controller";

jest.mock("src/models/user.model");
jest.mock("src/services/redis");

const user = {
  fullName: "Fadhil Amadan",
  userId: "1",
  accountNumber: "12345",
  registrationNumber: "67890",
  emailAddress: "fadhil.amadan@mitrais.com",
};

describe("UserController", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let req: Partial<Request | any>;
  let res: Partial<Response>;

  beforeEach(() => {
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("should create and return a new user", async () => {
      req = {
        body: { fullName: user.fullName, emailAddress: user.emailAddress },
        user: { userId: user.userId },
      };

      const mockUser = { save: jest.fn().mockResolvedValue(user) };
      (User as unknown as jest.Mock).mockImplementation(() => mockUser);
      await createUser(req as Request, res as Response);

      expect(mockUser.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(user);
      expect(User).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: user.fullName,
          emailAddress: user.emailAddress,
        }),
      );
    });

    it("should return a 400 error on save failure", async () => {
      req = {
        body: { fullName: user.fullName, emailAddress: user.emailAddress },
        user: { userId: user.userId },
      };

      const error = new Error("Error");
      const mockUser = { save: jest.fn().mockRejectedValue(error) };
      (User as unknown as jest.Mock).mockImplementation(() => mockUser);
      await createUser(req as Request, res as Response);

      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(error);
    });
  });

  describe("getUserByAccountNumber", () => {
    it("should return user from cache if available", async () => {
      req = { params: { accountNumber: "12345" } };

      (getCache as jest.Mock).mockResolvedValue(user);
      await getUserByAccountNumber(req as Request, res as Response);

      expect(getCache).toHaveBeenCalledWith("userAccountNumber:12345");
      expect(User.findOne).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(user);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
    });

    it("should fetch user from database if not cached", async () => {
      req = { params: { accountNumber: "12345" } };

      (getCache as jest.Mock).mockResolvedValue(null);
      (User.findOne as jest.Mock).mockResolvedValue(user);
      (setCache as jest.Mock).mockResolvedValue(null);
      await getUserByAccountNumber(req as Request, res as Response);

      expect(getCache).toHaveBeenCalledTimes(1);
      expect(getCache).toHaveBeenCalledWith("userAccountNumber:12345");
      expect(User.findOne).toHaveBeenCalledWith({ accountNumber: "12345" });
      expect(setCache).toHaveBeenCalledWith(
        "userAccountNumber:12345",
        user,
        3600,
      );
      expect(res.json).toHaveBeenCalledWith(user);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
    });

    it("should return 404 if user not found", async () => {
      req = { params: { accountNumber: "12345" } };

      (getCache as jest.Mock).mockResolvedValue(null);
      (User.findOne as jest.Mock).mockResolvedValue(null);
      await getUserByAccountNumber(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should handle errors", async () => {
      req = { params: { accountNumber: "12345" } };

      const error = new Error("Error");
      (getCache as jest.Mock).mockResolvedValue(null);
      (User.findOne as jest.Mock).mockRejectedValue(error);
      await getUserByAccountNumber(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(error);
    });
  });

  describe("getUserByRegistrationNumber", () => {
    it("should return user from cache if available", async () => {
      req = { params: { registrationNumber: "67890" } };

      (getCache as jest.Mock).mockResolvedValue(user);
      await getUserByRegistrationNumber(req as Request, res as Response);

      expect(getCache).toHaveBeenCalledWith("userRegistrationNumber:67890");
      expect(User.findOne).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(user);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
    });

    it("should fetch user from database if not cached", async () => {
      req = { params: { registrationNumber: "67890" } };

      (getCache as jest.Mock).mockResolvedValue(null);
      (User.findOne as jest.Mock).mockResolvedValue(user);
      (setCache as jest.Mock).mockResolvedValue(null);
      await getUserByRegistrationNumber(req as Request, res as Response);

      expect(getCache).toHaveBeenCalledTimes(1);
      expect(getCache).toHaveBeenCalledWith("userRegistrationNumber:67890");
      expect(User.findOne).toHaveBeenCalledWith({
        registrationNumber: "67890",
      });
      expect(setCache).toHaveBeenCalledWith(
        "userRegistrationNumber:67890",
        user,
        3600,
      );
      expect(res.json).toHaveBeenCalledWith(user);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
    });

    it("should return 404 if user not found", async () => {
      req = { params: { registrationNumber: "67890" } };

      (getCache as jest.Mock).mockResolvedValue(null);
      (User.findOne as jest.Mock).mockResolvedValue(null);
      await getUserByRegistrationNumber(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should handle errors", async () => {
      req = { params: { registrationNumber: "67890" } };

      const error = new Error("Error");
      (getCache as jest.Mock).mockResolvedValue(null);
      (User.findOne as jest.Mock).mockRejectedValue(error);
      await getUserByRegistrationNumber(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(error);
    });
  });
});
