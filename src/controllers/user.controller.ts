import { Request, Response } from "express";
import { faker } from "@faker-js/faker";

import { User } from "src/models/user.model";
import { getCache, setCache } from "src/services/redis";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createUser = async (req: Request | any, res: Response) => {
  const user = new User({
    ...req.body,
    userId: req.user!.userId,
    accountNumber: faker.finance.accountNumber(5),
    registrationNumber: faker.finance.accountNumber(),
  });

  try {
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getUserByAccountNumber = async (req: Request, res: Response) => {
  const { accountNumber } = req.params;

  try {
    const cacheKey = `userAccountNumber:${accountNumber}`;
    const cachedUser = await getCache(cacheKey);
    if (cachedUser) return res.json(cachedUser);

    const user = await User.findOne({ accountNumber });
    if (user) {
      await setCache(cacheKey, user, 3600); // REDIS: cache for 1 hour
      return res.json(user);
    }

    return res.status(404).json({ message: "User not found" });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getUserByRegistrationNumber = async (
  req: Request,
  res: Response,
) => {
  const { registrationNumber } = req.params;

  try {
    const cacheKey = `userRegistrationNumber:${registrationNumber}`;
    const cachedUser = await getCache(cacheKey);
    if (cachedUser) return res.json(cachedUser);

    const user = await User.findOne({ registrationNumber });
    if (user) {
      await setCache(cacheKey, user, 3600); // REDIS: cache for 1 hour
      return res.json(user);
    }

    return res.status(404).json({ message: "User not found" });
  } catch (error) {
    res.status(400).send(error);
  }
};
