const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (context) => {
  if (!context.token) {
    throw new Error("Not authorized, no token");
  }

  try {
    const decoded = jwt.verify(context.token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw new Error("Not authorized, token failed");
  }
};

const authorizeRoles = (user, roles) => {
  if (!roles.includes(user.role)) {
    throw new Error("Not authorized for this role");
  }
};

module.exports = { protect, authorizeRoles };
