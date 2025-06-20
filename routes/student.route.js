import e from "express";
import { verifyAuth } from "../middleware/verifyAuth.js";
import { validateAddStudent, validateDeleteStudent, validateUpdateStudent } from "../validators/studentValidation.js";
import { handleValidationErrors } from "../middleware/handleValidation.js";
import { add, remove, update } from "../controllers/student.controller.js";

const router = e.Router({mergeParams: true})

router.post("/", verifyAuth, validateAddStudent, handleValidationErrors, add)

router.put("/:studentId", verifyAuth, validateUpdateStudent, handleValidationErrors, update)

router.delete("/:studentId",verifyAuth, validateDeleteStudent, handleValidationErrors, remove)

export default router