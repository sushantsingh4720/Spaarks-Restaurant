import { Router } from "express";
import { test, register, login, logout } from "../controllers/auth.js";
const router = Router();

router.get("/test", test);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
export default router;
