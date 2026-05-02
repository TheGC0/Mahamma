import Task from "../models/Task.js";

// @desc    Get all tasks (with optional filtering)
// @route   GET /api/tasks?status=open&category=Programming&search=keyword
// @access  Public
export const getTasks = async (req, res, next) => {
  try {
    const { status, category, search, minBudget, maxBudget, sort } = req.query;
    const filter = {};

    if (status) filter.Status = status;
    if (category) filter.Category = category;
    if (req.query.clientId) filter.ClientID = req.query.clientId;
    if (minBudget || maxBudget) {
      filter.Budget = {};
      if (minBudget) filter.Budget.$gte = Number(minBudget);
      if (maxBudget) filter.Budget.$lte = Number(maxBudget);
    }
    if (search) {
      filter.$or = [
        { Title: { $regex: search, $options: "i" } },
        { Description: { $regex: search, $options: "i" } },
        { Tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const sortOptions = { createdAt: -1 };
    if (sort === "budget_asc") sortOptions.Budget = 1;
    else if (sort === "budget_desc") sortOptions.Budget = -1;
    else if (sort === "oldest") sortOptions.createdAt = 1;

    const tasks = await Task.find(filter)
      .populate("ClientID", "Name Email Rating")
      .sort(sortOptions);

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Public
export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "ClientID",
      "Name Email Rating Major"
    );

    if (task) {
      res.json(task);
    } else {
      res.status(404);
      throw new Error("Task not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private (client only)
export const createTask = async (req, res, next) => {
  try {
    const { Title, Description, Budget, Category, Deadline, Tags } = req.body;

    if (Deadline) {
      const deadline = new Date(Deadline);
      if (isNaN(deadline.getTime()) || deadline <= new Date()) {
        res.status(400);
        throw new Error("Deadline must be a valid future date");
      }
    }

    const task = await Task.create({
      ClientID: req.user._id,
      Title,
      Description,
      Budget,
      Category,
      Deadline: Deadline ? new Date(Deadline) : undefined,
      Tags: Tags || [],
    });

    const populated = await Task.findById(task._id).populate(
      "ClientID",
      "Name Email"
    );

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private (owner only)
export const updateTask = async (req, res, next) => {
  try {
    const { Title, Description, Budget, Category, Status, Deadline, Tags } =
      req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    if (task.ClientID.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to update this task");
    }

    if (Deadline) {
      const deadline = new Date(Deadline);
      if (isNaN(deadline.getTime())) {
        res.status(400);
        throw new Error("Deadline must be a valid date");
      }
      task.Deadline = deadline;
    }

    if (Title !== undefined) task.Title = Title;
    if (Description !== undefined) task.Description = Description;
    if (Budget !== undefined) task.Budget = Budget;
    if (Category !== undefined) task.Category = Category;
    if (Status !== undefined) task.Status = Status;
    if (Tags !== undefined) task.Tags = Tags;

    const updatedTask = await task.save();
    const populated = await Task.findById(updatedTask._id).populate(
      "ClientID",
      "Name Email"
    );

    res.json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private (owner only)
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    if (
      task.ClientID.toString() !== req.user._id.toString() &&
      req.user.Role !== "admin"
    ) {
      res.status(403);
      throw new Error("Not authorized to delete this task");
    }

    await task.deleteOne();
    res.json({ message: "Task removed" });
  } catch (error) {
    next(error);
  }
};
