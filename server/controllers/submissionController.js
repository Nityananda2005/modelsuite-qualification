const Submission = require("../models/Submission");
const Task = require("../models/Task");

// @desc Submit a task with file upload
// @route POST /api/submissions/:taskId
// @access Talent
const submitTask = async (req, res) => {
  const { taskId } = req.params;
  const { notes } = req.body;

  try {
    // Generate URLs for uploaded files
    const fileUrls =
      req.files && req.files.length > 0
        ? req.files.map(
          (file) => `http://localhost:5000/uploads/${file.filename}`
        )
        : [];

    // Find existing submission
    let submission = await Submission.findOne({
      taskId,
      talentId: req.user._id,
    });

    if (submission) {
      submission.fileUrls = fileUrls;
      submission.notes = notes;

      // Remove old single-file field
      submission.set("fileUrl", undefined);

      await submission.save();
    } else {
      submission = await Submission.create({
        taskId,
        talentId: req.user._id,
        fileUrls,
        notes,
      });
    }

    // Update task status
    await Task.findByIdAndUpdate(taskId, {
      status: "Submitted",
    });

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc Get submission
const getSubmission = async (req, res) => {
  try {
    const submission = await Submission.findOne({
      taskId: req.params.taskId,
    }).populate("talentId", "name email");

    if (!submission) {
      return res.status(404).json({
        message: "No submission found for this task",
      });
    }

    res.json(submission);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc Get all submissions
const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({})
      .populate("taskId", "title dueDate status")
      .populate("talentId", "name email")
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc Review submission
const reviewSubmission = async (req, res) => {
  const { reviewStatus } = req.body;

  try {
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { reviewStatus },
      { new: true }
    )
      .populate("taskId", "title status")
      .populate("talentId", "name email");

    if (!submission) {
      return res.status(404).json({
        message: "Submission not found",
      });
    }

    res.json(submission);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  submitTask,
  getSubmission,
  getAllSubmissions,
  reviewSubmission,
};