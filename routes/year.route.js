import e from "express";
import { add, get } from "../controllers/year.controller.js";
import { verifyAuth } from "../middleware/verifyAuth.js";
import { validateGetYear, validateYearAdd } from "../validators/courseValidation.js";
import { handleValidationErrors } from "../middleware/handleValidation.js";
import { upload } from "../utils/multer.config.js";

const router = e.Router({ mergeParams: true });

router.post("/", verifyAuth, upload.single("file"), validateYearAdd, handleValidationErrors, add) // route to add new years in courses

router.get("/:yearId", verifyAuth, validateGetYear, handleValidationErrors, get) // router to get students in a perticullar year

router.put("/:yearId", () => { }) // route to update already existing year

router.delete("/:yearId", () => { }) // route to delete existing year

export default router