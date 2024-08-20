import { Request, Response } from "express";

import { Account } from "src/models/account.model";
import { hashPassword } from "src/utils/hash";
import { generateToken } from "src/utils/jwt";
import { getAccountByLastLogin, login } from "./account.controller";

jest.mock("src/models/account.model");
jest.mock("src/utils/hash");
jest.mock("src/utils/jwt");

const account = {
  accountId: "123",
  userId: "1",
  userName: "Fadhilamadan",
  password: "hashed-password",
  lastLoginDateTime: new Date(),
  save: jest.fn(),
};

describe("AccountController", () => {
  let req: Partial<Request>;
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

  describe("login", () => {
    it("should return a token if credentials are valid", async () => {
      const token = "jwt-token";
      req = {
        body: { userName: account.userName, password: account.password },
      };

      (Account.findOne as jest.Mock).mockResolvedValue(account);
      (hashPassword as jest.Mock).mockReturnValue(account.password);
      (generateToken as jest.Mock).mockReturnValue(token);
      await login(req as Request, res as Response);

      expect(Account.findOne).toHaveBeenCalledWith({
        userName: account.userName,
      });
      expect(hashPassword).toHaveBeenCalledWith(account.password);
      expect(generateToken).toHaveBeenCalledWith({
        accountId: account.accountId,
        userId: account.userId,
        userName: account.userName,
      });
      expect(account.lastLoginDateTime).toBeInstanceOf(Date);
      expect(account.save).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ token });
    });

    it("should return 400 if credentials are invalid", async () => {
      req = {
        body: { userName: account.userName, password: "wrong-password" },
      };

      (Account.findOne as jest.Mock).mockResolvedValue(account);
      (hashPassword as jest.Mock).mockReturnValue("incorrect-hash");
      await login(req as Request, res as Response);

      expect(Account.findOne).toHaveBeenCalledWith({
        userName: account.userName,
      });
      expect(hashPassword).toHaveBeenCalledWith("wrong-password");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Access Denied: Invalid Credentials!",
      });
    });

    it("should return 400 if account is not found", async () => {
      req = {
        body: { userName: account.userName, password: "password" },
      };

      (Account.findOne as jest.Mock).mockResolvedValue(null);
      await login(req as Request, res as Response);

      expect(Account.findOne).toHaveBeenCalledWith({
        userName: account.userName,
      });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Access Denied: Invalid Credentials!",
      });
    });

    it("should handle errors", async () => {
      req = {
        body: { userName: account.userName, password: "password" },
      };

      const error = new Error("Error");
      (Account.findOne as jest.Mock).mockRejectedValue(error);
      await login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(error);
    });
  });

  describe("getAccountByLastLogin", () => {
    it("should return accounts with last login date older than 3 days", async () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      req = {};

      const accounts = [account];
      (Account.find as jest.Mock).mockResolvedValue(accounts);
      await getAccountByLastLogin(req as Request, res as Response);

      expect(Account.find).toHaveBeenCalledWith({
        lastLoginDateTime: { $lt: threeDaysAgo },
      });
      expect(res.json).toHaveBeenCalledWith(accounts);
    });

    it("should handle errors", async () => {
      req = {};

      const error = new Error("Error");
      (Account.find as jest.Mock).mockRejectedValue(error);
      await getAccountByLastLogin(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(error);
    });
  });
});
