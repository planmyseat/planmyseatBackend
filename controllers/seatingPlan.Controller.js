import Block from "../models/block.model.js";
import SeatingPlan from "../models/seatingPlan.model.js";
import { generateSeatingPlanAlgo } from "../utils/algo.js";
import Course from "../models/course.model.js";

  export const generateSeatingPlan = async (req, res) => {
    const { blockId, title, date, session, courses } = req.body;
    const userId = req.user._id;
    const courseData = [];

    try {
      const block = await Block.findOne({ _id: blockId, createdBy: userId })
        .select("block classes")
        .lean();

      if (!block) {
        return res.status(404).json({ error: "Block not found" });
      }

      for (const course of courses) {
        let data = await Course.findOne({
          _id: course.courseId,
          createdBy: userId,
        }).select("course years");

        if (!data) {
          return res
            .status(404)
            .json({ error: "One of the courses was not found" });
        }

        const year = data.years.id(course.yearId);
        if (!year) {
          return res.status(404).json({ error: "Year in course not found" });
        }

        const filteredStudents = year.students.filter((student) =>
          student.subjects.includes(course.subject)
        );

        courseData.push({
          name: `${data.course} year ${year.year}`,
          students: filteredStudents,
        });
      }

      if (courseData.length < 2) {
        return res.status(422).json({ error: "At least 2 courses are required" });
      }

      const totalCapacity = block.classes.reduce(
        (total, cls) => total + (cls.capacity || 0),
        0
      );
      const totalStudents = courseData.reduce(
        (total, course) => total + course.students.length,
        0
      );

      if (totalStudents > totalCapacity) {
        return res
          .status(409)
          .json({ error: "Total students exceed block capacity" });
      }

      if (totalStudents < 1) {
        return res.status(409).json({ error: "Students not found" });
      }

      const plan = generateSeatingPlanAlgo(
        courseData,
        block,
        totalCapacity,
        totalStudents
      );

      const seatingplan = new SeatingPlan({
        title,
        date,
        session,
        blockId,
        createdBy: userId,
        students: plan,
        courses,
      });

      await seatingplan.save();

      return res.status(200).json(seatingplan);
    } catch (error) {
      console.error("Error generating seating plan:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

export const getPlans = async (req, res) => {
  const userId = req.user._id;

  try {
    const plans = await SeatingPlan.find({ createdBy: userId })
      .sort({ createdAt: -1 }).select(" -__v -updatedAt -createdAt") // Latest plans first
      .lean();

    if (plans.length === 0) {
      return res
        .status(200)
        .json([]);
    }
    return res.status(200).json( plans );
  } catch (error) {
    console.error("Error fetching seating plans:", error);
    return res.status(500).json({ error: "Failed to fetch seating plans" });
  }
};

export const updateSeatingPlan = async (req, res) => {
  const { title, date, session, blockId, courses } = req.body;
  const {id:seatingPlanId} = req.params;
  const userId = req.user._id;
  
  
  try {
    const existingPlan = await SeatingPlan.findOne({
      _id: seatingPlanId,
      createdBy: userId,
    });
    if (!existingPlan) {
      return res.status(404).json({ error: "Seating plan not found" });
    }

    const block = await Block.findOne({ _id: blockId, createdBy: userId })
      .select("block classes")
      .lean();
    if (!block) {
      return res.status(404).json({ error: "Block not found" });
    }

    const courseData = [];
    for (const course of courses) {
      const courseDoc = await Course.findOne({
        _id: course.courseId,
        createdBy: userId,
      }).select("course years");
      if (!courseDoc) {
        return res
          .status(404)
          .json({ error: "One of the courses was not found" });
      }

      const year = courseDoc.years.id(course.yearId);
      if (!year) {
        return res.status(404).json({ error: "Year in course not found" });
      }

      const filteredStudents = year.students.filter((student) =>
        student.subjects.includes(course.subject)
      );

      courseData.push({
        name: `${courseDoc.course} year ${year.year}`,
        students: filteredStudents,
      });
    }

    if (courseData.length < 2) {
      return res.status(422).json({ error: "At least 2 courses are required" });
    }

    const totalCapacity = block.classes.reduce(
      (sum, cls) => sum + (cls.capacity || 0),
      0
    );
    const totalStudents = courseData.reduce(
      (sum, c) => sum + c.students.length,
      0
    );

    if (totalStudents > totalCapacity) {
      return res
        .status(409)
        .json({ error: "Total students exceed block capacity" });
    }

    if (totalStudents < 1) {
      return res.status(409).json({ error: "No students found" });
    }

    const updatedSeating = generateSeatingPlanAlgo(
      courseData,
      block,
      totalCapacity,
      totalStudents
    );

    existingPlan.title = title;
    existingPlan.date = date;
    existingPlan.session = session;
    existingPlan.blockId = blockId;
    existingPlan.students = updatedSeating;
    existingPlan.courses = courses;

    await existingPlan.save();

    return res
      .status(200)
      .json(existingPlan);
  } catch (error) {
    console.error("Error updating seating plan:", error);
    return res.status(500).json({ error: "Failed to update seating plan" });
  }
};

export const markAttendance = async (req, res) => {
  const { planId, selectedCourse, presentStudents, className } = req.body;
  const userId = req.user._id;

  try {
    const plan = await SeatingPlan.findOne({
      _id: planId,
      createdBy: userId,
    });

    if (!plan) {
      return res.status(404).json({ message: "Seating plan not found." });
    }

    // Loop through students and update attendance
    plan.students = plan.students.map((student) => {
      if (
        student.course === selectedCourse &&
        student.className === className
      ) {
        if (presentStudents.includes(student.uid)) {
          student.attendance = true;
        } else {
          student.attendance = false;
        }
      }
      return student;
    });

    await plan.save();

    return res.status(200).json({
      message: "Attendance marked successfully",
      updatedPlan: plan,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

