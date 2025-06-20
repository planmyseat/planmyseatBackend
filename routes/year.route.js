import e from "express";
import { validateDeleteYear, validateUpdateYear, validateYearAdd } from "../validators/courseValidation.js";
import { add, remove, update } from "../controllers/year.controller.js";
import { handleValidationErrors } from "../middleware/handleValidation.js";
import { verifyAuth } from "../middleware/verifyAuth.js";
import { upload } from "../utils/multer.config.js";

const router = e.Router({ mergeParams: true });

router.post("/", verifyAuth, upload.single("file"), validateYearAdd, handleValidationErrors, add)

router.put("/:yearId", verifyAuth, validateUpdateYear, handleValidationErrors, update) 

router.delete("/:yearId", verifyAuth, validateDeleteYear, handleValidationErrors, remove)

export default router