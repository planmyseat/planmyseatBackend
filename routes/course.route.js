import e from "express";
import { add, get, remove, update } from "../controllers/course.controller.js"
import { verifyAuth } from "../middleware/verifyAuth.js";
import { validateCourse, validateCourseDelete, validateCourseUpdate } from "../validators/courseValidation.js";
import { handleValidationErrors } from "../middleware/handleValidation.js";

const router = e.Router()

router.get("/", verifyAuth, get)

router.post("/", verifyAuth, validateCourse, handleValidationErrors, add)

router.put("/:id", verifyAuth, validateCourseUpdate, handleValidationErrors, update) 

router.delete("/:id", verifyAuth, validateCourseDelete, handleValidationErrors, remove)

export default router