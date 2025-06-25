import e from "express";
import { verifyAuth } from "../middleware/verifyAuth.js";
import { generateSeatingPlan, getPlans } from "../controllers/seatingPlan.Controller.js";
const router = e.Router();

router.get("/getPlans",verifyAuth,getPlans)
router.post("/", verifyAuth,generateSeatingPlan)

export default router;