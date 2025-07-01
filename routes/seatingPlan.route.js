import e from "express";
import { verifyAuth } from "../middleware/verifyAuth.js";
import { generateSeatingPlan, getPlans, markAttendance, requestExcel, updateSeatingPlan } from "../controllers/seatingPlan.Controller.js";
import { validateAttendance, validateExcel, validateSeatingPlan, validateUpdateSeatingPlan } from "../validators/seatingPlanValidator.js";
import { handleValidationErrors } from "../middleware/handleValidation.js";
const router = e.Router();

router.get("/", verifyAuth, getPlans)
router.post("/", verifyAuth, validateSeatingPlan, handleValidationErrors, generateSeatingPlan)
router.put("/:id", verifyAuth, validateUpdateSeatingPlan, handleValidationErrors, updateSeatingPlan)
router.patch("/:id", verifyAuth, validateAttendance, handleValidationErrors, markAttendance)
router.get("/:id", verifyAuth, validateExcel, handleValidationErrors, requestExcel)

export default router;