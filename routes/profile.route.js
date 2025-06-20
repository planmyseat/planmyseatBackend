import e from "express";
import { verifyAuth } from "../middleware/verifyAuth.js";
import { getProfile } from "../controllers/profile.controller.js";

const router = e.Router()

router.get("/", verifyAuth, getProfile);

export default router