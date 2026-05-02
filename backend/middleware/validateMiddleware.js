export const validateRegister = (req, res, next) => {
  const { Name, Email, Password, Role } = req.body;
  const errors = [];

  if (!Name || Name.trim().length < 2)
    errors.push("Name must be at least 2 characters");
  if (!Email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email))
    errors.push("Valid email is required");
  if (!Password || Password.length < 6)
    errors.push("Password must be at least 6 characters");
  if (Role && !["client", "provider", "admin"].includes(Role))
    errors.push("Role must be client, provider, or admin");

  if (errors.length > 0) {
    res.status(400);
    return next(new Error(errors.join(". ")));
  }
  next();
};

export const validateLogin = (req, res, next) => {
  const { Email, Password } = req.body;
  const errors = [];

  if (!Email) errors.push("Email is required");
  if (!Password) errors.push("Password is required");

  if (errors.length > 0) {
    res.status(400);
    return next(new Error(errors.join(". ")));
  }
  next();
};

export const validateTask = (req, res, next) => {
  const { Title, Description, Budget, Category } = req.body;
  const errors = [];

  if (!Title || Title.trim().length < 5)
    errors.push("Title must be at least 5 characters");
  if (!Description || Description.trim().length < 20)
    errors.push("Description must be at least 20 characters");
  if (!Budget || isNaN(Budget) || Number(Budget) < 1)
    errors.push("Budget must be a positive number");
  const validCategories = ["Design","Programming","Video Editing","Device Fixing","Content Writing","Translation","Marketing","Photography","Tutoring","Other"];
  if (!Category) errors.push("Category is required");
  else if (!validCategories.includes(Category)) errors.push("Invalid category");

  if (errors.length > 0) {
    res.status(400);
    return next(new Error(errors.join(". ")));
  }
  next();
};

export const validateService = (req, res, next) => {
  const { Title, Description, Price, Category, DeliveryTime } = req.body;
  const errors = [];

  if (!Title || Title.trim().length < 5)
    errors.push("Title must be at least 5 characters");
  if (!Description || !Description.trim())
    errors.push("Description is required");
  if (!Price || isNaN(Price) || Number(Price) < 1)
    errors.push("Price must be a positive number");
  const validCategories = ["Design","Programming","Video Editing","Device Fixing","Content Writing","Translation","Marketing","Photography","Tutoring","Other"];
  if (!Category) errors.push("Category is required");
  else if (!validCategories.includes(Category)) errors.push("Invalid category");
  if (!DeliveryTime) errors.push("Delivery time is required");

  if (errors.length > 0) {
    res.status(400);
    return next(new Error(errors.join(". ")));
  }
  next();
};

export const validateProposal = (req, res, next) => {
  const { BidAmount, EstimatedTime, CoverLetter } = req.body;
  const errors = [];

  if (!BidAmount || isNaN(BidAmount) || Number(BidAmount) < 1)
    errors.push("BidAmount must be a positive number");
  if (!EstimatedTime) errors.push("EstimatedTime is required");
  if (!CoverLetter || CoverLetter.trim().length < 20)
    errors.push("CoverLetter must be at least 20 characters");

  if (errors.length > 0) {
    res.status(400);
    return next(new Error(errors.join(". ")));
  }
  next();
};

export const validateReview = (req, res, next) => {
  const { Score } = req.body;
  const errors = [];

  if (Score === undefined || Score === null)
    errors.push("Score is required");
  else if (isNaN(Score) || Number(Score) < 1 || Number(Score) > 5)
    errors.push("Score must be between 1 and 5");

  if (errors.length > 0) {
    res.status(400);
    return next(new Error(errors.join(". ")));
  }
  next();
};

export const validateMessage = (req, res, next) => {
  const { Body } = req.body;
  const errors = [];

  if (!Body || Body.trim().length === 0)
    errors.push("Message body is required");
  else if (Body.trim().length > 2000)
    errors.push("Message body must be 2000 characters or less");

  if (errors.length > 0) {
    res.status(400);
    return next(new Error(errors.join(". ")));
  }
  next();
};
