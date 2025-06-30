import e from "express";
import { verifyAuth } from "../middleware/verifyAuth.js";
import { generateSeatingPlan, getPlans, markAttendance, updateSeatingPlan } from "../controllers/seatingPlan.Controller.js";
import { validateSeatingPlan, validateUpdateSeatingPlan } from "../validators/seatingPlanValidator.js";
import { handleValidationErrors } from "../middleware/handleValidation.js";
const router = e.Router();

router.get("/", verifyAuth, getPlans)
router.post("/", verifyAuth, validateSeatingPlan, handleValidationErrors, generateSeatingPlan)
router.put("/:id", verifyAuth, validateUpdateSeatingPlan, handleValidationErrors, updateSeatingPlan)
router.post("/markAttendance",verifyAuth,markAttendance)

export default router;