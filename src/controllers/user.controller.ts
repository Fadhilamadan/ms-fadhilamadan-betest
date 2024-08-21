import { Request, Response } from "express";
import { faker } from "@faker-js/faker";

import { User } from "src/models/user.model";
import { getCache, setCache } from "src/services/redis";

const CACHE_EXPIRY = 3600; // REDIS: cache for 1 hour
const USER_ACCOUNT_NUMBER = "userAccountNumber";
const USER_REGISTRATION_NUMBER = "userRegistrationNumber";

export const createUser = async (
  req: Request | any, // eslint-disable-line @typescript-eslint/no-explicit-any
  res: Response,
) => {
  const user = new User({
    ...req.body,
    userId: req.user!.userId,
    accountNumber: faker.finance.accountNumber(5),
    registrationNumber: faker.finance.accountNumber(),
  });

  try {
    const savedUser = await user.save();

    const accountNumberCacheKey = `${USER_ACCOUNT_NUMBER}:${savedUser.accountNumber}`;
    await setCache(accountNumberCacheKey, savedUser, CACHE_EXPIRY);

    const registrationNumberCacheKey = `${USER_REGISTRATION_NUMBER}:${savedUser.registrationNumber}`;
    await setCache(registrationNumberCacheKey, savedUser, CACHE_EXPIRY);

    res.json(savedUser);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getUserByAccountNumber = async (
  req: Request | any, // eslint-disable-line @typescript-eslint/no-explicit-any
  res: Response,
) => {
  const { accountNumber } = req.params;

  try {
    const cacheKey = `${USER_ACCOUNT_NUMBER}:${accountNumber}`;
    const cachedUser = await getCache(cacheKey);

    if (cachedUser) {
      if (req.user!.userId !== cachedUser.userId) {
        return res
          .status(403)
          .json({ message: "Access Denied: Invalid Request Account Number!" });
      }

      return res.json(cachedUser);
    }

    const user = await User.findOne({ accountNumber });

    if (user) {
      if (req.user?.userId !== user.userId) {
        return res
          .status(403)
          .json({ message: "Access Denied: Invalid Request Account Number!" });
      }

      await setCache(cacheKey, user, CACHE_EXPIRY);
      return res.json(user);
    }

    return res.status(404).json({ message: "Invalid: User Not Found" });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getUserByRegistrationNumber = async (
  req: Request | any, // eslint-disable-line @typescript-eslint/no-explicit-any
  res: Response,
) => {
  const { registrationNumber } = req.params;

  try {
    const cacheKey = `${USER_REGISTRATION_NUMBER}:${registrationNumber}`;
    const cachedUser = await getCache(cacheKey);

    if (cachedUser) {
      if (req.user!.userId !== cachedUser.userId) {
        return res.status(403).json({
          message: "Access Denied: Invalid Request Registration Number!",
        });
      }

      return res.json(cachedUser);
    }

    const user = await User.findOne({ registrationNumber });

    if (user) {
      if (req.user?.userId !== user.userId) {
        return res.status(403).json({
          message: "Access Denied: Invalid Request Registration Number!",
        });
      }

      await setCache(cacheKey, user, CACHE_EXPIRY);
      return res.json(user);
    }

    return res.status(404).json({ message: "Invalid: User Not Found" });
  } catch (error) {
    res.status(400).send(error);
  }
};
