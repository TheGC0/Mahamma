import User from "../models/User.js";
import Report from "../models/Report.js";

// GET /api/admin/users
export const getAllUsers = async (req, res, next) => {
  try {
    const { verified, role, search } = req.query;
    const filter = {};
    if (verified) filter.Verified = verified;
    if (role) filter.Role = role;
    if (search) filter.Name = { $regex: search, $options: "i" };

    const users = await User.find(filter).select("-Password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/users/:id/verify
export const updateUserVerification = async (req, res, next) => {
  try {
    const { Verified } = req.body;
    if (!["pending", "approved", "rejected"].includes(Verified)) {
      res.status(400);
      return next(new Error("Invalid verification status"));
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { Verified },
      { new: true }
    ).select("-Password");
    if (!user) { res.status(404); return next(new Error("User not found")); }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/reports
export const getAllReports = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .populate("ReporterID", "Name Email Role")
      .populate("RespondentID", "Name Email Role")
      .populate("ContractID", "AgreedAmount Status")
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/reports
export const createReport = async (req, res, next) => {
  try {
    const { RespondentID, ContractID, Type, Description, Severity } = req.body;
    if (!Type || !Description) {
      res.status(400);
      return next(new Error("Type and Description are required"));
    }
    const report = await Report.create({
      ReporterID: req.user._id,
      RespondentID,
      ContractID,
      Type,
      Description,
      Severity: Severity || "medium",
    });
    const populated = await report.populate("ReporterID", "Name Email Role");
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/reports/:id/status
export const updateReportStatus = async (req, res, next) => {
  try {
    const { Status, Resolution } = req.body;
    if (!["pending", "reviewing", "resolved"].includes(Status)) {
      res.status(400);
      return next(new Error("Invalid status"));
    }
    const update = { Status };
    if (Status === "resolved" && Resolution) update.Resolution = Resolution;

    const report = await Report.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate("ReporterID", "Name Email Role")
      .populate("RespondentID", "Name Email Role");
    if (!report) { res.status(404); return next(new Error("Report not found")); }
    res.json(report);
  } catch (err) {
    next(err);
  }
};
