import Block from '../models/block.model.js'; // Adjust path if needed

export const fetch = async (req, res) => {
  try {
    const userId = req.user._id;

   const blocks = await Block.find({ createdBy: userId })
      .sort({ createdAt: 1 })
      .select('-createdBy -__v -createdAt -updatedAt')
      .lean();

    res.status(200).json(blocks);
  } catch (error) {
    console.error('Error fetching blocks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const add = async (req, res) => {
  try {
    const userId = req.user._id;
    const { block } = req.body;

    const trimmedBlock = block.trim();

    const exists = await Block.findOne({ block: trimmedBlock, createdBy: userId });
    if (exists) {
      return res.status(409).json({ error: 'Block already exists' });
    }

    const newBlock = await Block.create({
      block: trimmedBlock,
      createdBy: userId,
      classes: [],
    });

    const blockObj = newBlock.toObject();
    delete blockObj.createdBy;
    delete blockObj.__v;
    delete blockObj.createdAt;
    delete blockObj.updatedAt;

    return res.status(201).json(blockObj);
  } catch (error) {
    console.error('Error adding block:', error);
    return res.status(500).json({ error: 'Something went wrong while adding the block' });
  }
};

export const update = async (req, res) => {
  try {
    const userId = req.user._id;
    const { block } = req.body;
    const { id } = req.params;

    const trimmedBlock = block.trim();

    const existingBlock = await Block.findOne({ _id: id, createdBy: userId });
    if (!existingBlock) {
      return res.status(404).json({ error: 'Block not found or unauthorized' });
    }

    const duplicate = await Block.findOne({
      _id: { $ne: id },
      block: trimmedBlock,
      createdBy: userId,
    });

    if (duplicate) {
      return res.status(409).json({ error: 'Block name already exists' });
    }

    existingBlock.block = trimmedBlock;
    await existingBlock.save();

    const { _id, block: updatedBlock, classes } = existingBlock.toObject();
    return res.status(200).json({ _id, block: updatedBlock, classes });
  } catch (error) {
    console.error('Error updating block:', error);
    return res.status(500).json({ error: 'Something went wrong while updating the block' });
  }
};


export const Delete = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const block = await Block.findOne({ _id: id, createdBy: userId });
    if (!block) {
      return res.status(404).json({ error: 'Block not found or unauthorized' });
    }

    await Block.deleteOne({ _id: id });

    return res.status(200).json({ message: 'Block deleted successfully' });
  } catch (error) {
    console.error('Error deleting block:', error);
    return res.status(500).json({ error: 'Something went wrong while deleting the block' });
  }
};
