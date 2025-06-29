import e from "express";
import { verifyAuth } from "../middleware/verifyAuth.js";
import { generateSeatingPlan, getPlans, markAttendance, updateSeatingPlan } from "../controllers/seatingPlan.Controller.js";
const router = e.Router();

router.get("/getPlans",verifyAuth,getPlans)
router.post("/", verifyAuth,generateSeatingPlan)
router.post("/updatePlan", verifyAuth,updateSeatingPlan)
router.post("/markAttendance",verifyAuth,markAttendance)

export default router;