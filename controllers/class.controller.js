import Block from "../models/block.model.js";

export const add = async (req, res) => {
  try {
    const userId = req.user._id || req.user;
    const blockId = req.params.id;
    const { className, row, columns } = req.body;

    const block = await Block.findOne({ _id: blockId, createdBy: userId });
    if (!block) {
      return res.status(404).json({ error: "Block not found or unauthorized" });
    }

    const exists = block.classes.some(
      (cls) => cls.className.toLowerCase() === className.trim().toLowerCase()
    );
    if (exists) {
      return res.status(409).json({ error: "Class already exists" });
    }

    block.classes.push({
      className: className.trim(),
      row: parseInt(row),
      columns: parseInt(columns),
      capacity: parseInt(row) * parseInt(columns)
    });

    await block.save();

    const blockObj = block.toObject();
    delete blockObj.createdBy;
    delete blockObj.__v;
    delete blockObj.createdAt;
    delete blockObj.updatedAt;

    return res.status(201).json(blockObj);
  } catch (err) {
    console.error("Error adding class:", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const update = async (req, res) => {
  try {
    const userId = req.user._id;
    const blockId = req.params.id;
    const classNameParam = req.params.name.toLowerCase();

    const { className, row, columns } = req.body;

    const block = await Block.findOne({ _id: blockId, createdBy: userId });
    if (!block) {
      return res.status(404).json({ error: "Block not found" });
    }

    const targetClass = block.classes.find(
      (cls) => cls.className.toLowerCase() === classNameParam
    );

    if (!targetClass) {
      return res.status(404).json({ error: "Class not found" });
    }

    if (className) targetClass.className = className;
    if (row) targetClass.row = row;
    if (columns) targetClass.columns = columns;

    targetClass.capacity = targetClass.row * targetClass.columns;

    await block.save();

    const blockObj = block.toObject();
    delete blockObj.createdBy;
    delete blockObj.__v;
    delete blockObj.createdAt;
    delete blockObj.updatedAt;

    return res.status(200).json(blockObj);
  } catch (err) {
    console.error("Error updating class:", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const Delete = async (req, res) => {
  try {
    const userId = req.user._id || req.user;
    const blockId = req.params.id;
    const classNameParam = req.params.name?.toLowerCase();

    const block = await Block.findOne({ _id: blockId, createdBy: userId });
    if (!block) {
      return res.status(404).json({ error: "Block not found or unauthorized" });
    }

    const initialLength = block.classes.length;

    block.classes = block.classes.filter(
      (cls) => cls.className.toLowerCase() !== classNameParam
    );

    if (block.classes.length === initialLength) {
      return res.status(404).json({ error: "Class not found in this block" });
    }

    await block.save();

    const blockObj = block.toObject();
    delete blockObj.createdBy;
    delete blockObj.__v;
    delete blockObj.createdAt;
    delete blockObj.updatedAt;

    return res.status(200).json(blockObj);
  } catch (err) {
    console.error("Error deleting class:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};