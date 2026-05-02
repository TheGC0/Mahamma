export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      return next(new Error("Not authorized"));
    }
    if (!roles.includes(req.user.Role)) {
      res.status(403);
      return next(
        new Error(
          `Access denied. Required role: ${roles.join(" or ")}. Your role: ${req.user.Role}`
        )
      );
    }
    next();
  };
};
