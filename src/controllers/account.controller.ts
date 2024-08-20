import { Request, Response } from "express";

import { Account } from "src/models/account.model";
import { hashPassword } from "src/utils/hash";
import { generateToken } from "src/utils/jwt";

export const login = async (req: Request, res: Response) => {
  const { userName, password } = req.body;

  try {
    const account = await Account.findOne({ userName });
    if (!account || hashPassword(password) !== account.password) {
      return res
        .status(400)
        .json({ message: "Access Denied: Invalid Credentials!" });
    }

    const token = generateToken({
      accountId: account.accountId,
      userId: account.userId,
      userName: account.userName,
    });
    account.lastLoginDateTime = new Date();
    await account.save();

    res.json({ token });
  } catch (err) {
    res.status(400).json(err);
  }
};

export const getAccountByLastLogin = async (req: Request, res: Response) => {
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  try {
    const accounts = await Account.find({
      lastLoginDateTime: { $lt: threeDaysAgo },
    });
    res.json(accounts);
  } catch (error) {
    res.status(400).send(error);
  }
};
