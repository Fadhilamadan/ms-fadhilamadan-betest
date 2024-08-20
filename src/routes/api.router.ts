import { Router } from "express";

import accountRoutes from "src/routes/account.routes";
import userRoutes from "src/routes/user.routes";

const router = Router();

router.use("/account", accountRoutes);
router.use("/user", userRoutes);

export default router;
