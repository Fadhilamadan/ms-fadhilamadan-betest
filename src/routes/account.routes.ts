import { Router } from "express";

import {
  getAccountByLastLogin,
  login,
} from "src/controllers/account.controller";
import { authenticateJWT } from "src/middlewares/auth.middlewares";

const router = Router();

router.post("/login", login);
router.get("/lastLogin", authenticateJWT, getAccountByLastLogin);

export default router;
