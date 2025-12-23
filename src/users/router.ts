import express, { Router } from "express";
import { createAccountController, deleteAccountController, getUserController, updateAccountController, loginController } from "./controller";
import { authenticateToken } from "../utils/tokenManager";

const router: Router = express.Router();

router.get("/account", authenticateToken, getUserController)
router.put('/account', authenticateToken, updateAccountController);
router.delete('/account', authenticateToken, deleteAccountController);

router.post("/register", authenticateToken, createAccountController);
router.post("/login", loginController);

export default router;