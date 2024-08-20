import { Router } from "express";

import {
  createUser,
  getUserByAccountNumber,
  getUserByRegistrationNumber,
} from "src/controllers/user.controller";
import { authenticateJWT } from "src/middlewares/auth.middlewares";

const router = Router();

router.post("/", authenticateJWT, createUser);
router.get(
  "/accountNumber/:accountNumber",
  authenticateJWT,
  getUserByAccountNumber,
);
router.get(
  "/registrationNumber/:registrationNumber",
  authenticateJWT,
  getUserByRegistrationNumber,
);

export default router;
