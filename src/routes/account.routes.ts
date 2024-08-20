import { Router } from "express";

import {
  getAccountByLastLogin,
  login,
} from "src/controllers/account.controller";

const router = Router();

router.post("/login", login);
router.get("/lastLogin", getAccountByLastLogin);

export default router;
