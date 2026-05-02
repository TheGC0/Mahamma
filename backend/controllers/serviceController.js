import Service from "../models/Service.js";

// @desc    Get all services (with optional filtering)
// @route   GET /api/services?category=Design&search=logo&minPrice=50&maxPrice=500
// @access  Public
export const getServices = async (req, res, next) => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;
    const filter = {};

    if (category) filter.Category = category;
    if (req.query.providerId) filter.ProviderID = req.query.providerId;
    if (minPrice || maxPrice) {
      filter.Price = {};
      if (minPrice) filter.Price.$gte = Number(minPrice);
      if (maxPrice) filter.Price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { Title: { $regex: search, $options: "i" } },
        { Description: { $regex: search, $options: "i" } },
        { Tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const sortOptions = { createdAt: -1 };
    if (sort === "price_asc") sortOptions.Price = 1;
    else if (sort === "price_desc") sortOptions.Price = -1;
    else if (sort === "rating") sortOptions.AverageRating = -1;
    else if (sort === "oldest") sortOptions.createdAt = 1;

    const services = await Service.find(filter)
      .populate("ProviderID", "Name Email Rating Major")
      .sort(sortOptions);

    res.json(services);
  } catch (error) {
    next(error);
  }
};

// @desc    Get service by ID
// @route   GET /api/services/:id
// @access  Public
export const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id).populate(
      "ProviderID",
      "Name Email Rating Major"
    );

    if (service) {
      res.json(service);
    } else {
      res.status(404);
      throw new Error("Service not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a service
// @route   POST /api/services
// @access  Private (provider only)
export const createService = async (req, res, next) => {
  try {
    const { Title, Description, Price, Category, DeliveryTime, Tags } =
      req.body;

    const service = await Service.create({
      ProviderID: req.user._id,
      Title,
      Description,
      Price,
      Category,
      DeliveryTime,
      Tags: Tags || [],
    });

    const populated = await Service.findById(service._id).populate(
      "ProviderID",
      "Name Email"
    );

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private (owner only)
export const updateService = async (req, res, next) => {
  try {
    const { Title, Description, Price, Category, DeliveryTime, Tags } =
      req.body;

    const service = await Service.findById(req.params.id);

    if (!service) {
      res.status(404);
      throw new Error("Service not found");
    }

    if (service.ProviderID.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to update this service");
    }

    if (Title !== undefined) service.Title = Title;
    if (Description !== undefined) service.Description = Description;
    if (Price !== undefined) service.Price = Price;
    if (Category !== undefined) service.Category = Category;
    if (DeliveryTime !== undefined) service.DeliveryTime = DeliveryTime;
    if (Tags !== undefined) service.Tags = Tags;

    const updatedService = await service.save();
    const populated = await Service.findById(updatedService._id).populate(
      "ProviderID",
      "Name Email"
    );

    res.json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private (owner or admin)
export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      res.status(404);
      throw new Error("Service not found");
    }

    if (
      service.ProviderID.toString() !== req.user._id.toString() &&
      req.user.Role !== "admin"
    ) {
      res.status(403);
      throw new Error("Not authorized to delete this service");
    }

    await service.deleteOne();
    res.json({ message: "Service removed" });
  } catch (error) {
    next(error);
  }
};
