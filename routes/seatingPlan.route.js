import e from "express";
import { verifyAuth } from "../middleware/verifyAuth.js";
import { generateSeatingPlan } from "../controllers/seatingPlan.Controller.js";
const router = e.Router();

router.post("/", verifyAuth,generateSeatingPlan)

export default router;