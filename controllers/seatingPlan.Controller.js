import Block from "../models/block.model.js";
import SeatingPlan from "../models/seatingPlan.model.js";
import { ChangeDataForomat } from "../utils/changeDataFormat.js";
import { generateSeatingPlanAlgo } from "../utils/algo.js";
import { getFilteredCourseData } from "../utils/filterCoursebySubject.js";

export const generateSeatingPlan = async (req, res) => {
  const data = req.body;
  const { blockId, title, date, session } = data;

  const subjectMap = data.courses.map((course) => ({
    courseId: course.courseId,
    yearId: course.yearId,
    subject: course.subject,
  }));

  try {
    // 1. Fetch block
    const block = await Block.findById(blockId)
      .select(" -__v -createdAt -updatedAt")
      .lean();

    if (!block) {
      return res.status(404).json({ error: "Block not found" });
    }

    const filteredData = await getFilteredCourseData(subjectMap);

    // 3. Create UID map by course name
    const uidsbyCourse = ChangeDataForomat(filteredData);

    const classes = block.classes;
    const plan = generateSeatingPlanAlgo(uidsbyCourse, classes);

    const seatingPlanDoc = await SeatingPlan.create({
      title,
      date,
      session,
      blockId,
      createdBy: req.user._id,
      students: plan,
      courses: filteredData,
    });

    return res.status(200).json(seatingPlanDoc);
  } catch (error) {
    console.error("Error generating seating plan:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
