const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Performance = require("../models/Performance");
const { protect, authorizeRoles } = require("../middleware/authmiddleware");

const COMPANY_UNIQUE_CODE = process.env.COMPANY_UNIQUE_CODE;

// Salary Hike Logic
const calculateHike = (rating, skillLevel, attendanceScore) => {
  const avg = (rating + skillLevel + attendanceScore) / 3;

  if (avg >= 4.5) return 20;
  if (avg >= 4) return 15;
  if (avg >= 3) return 10;
  return 0;
};

// JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const resolvers = {
  Query: {
    hello: () => "Employee Performance System API is running",

    me: async (_, __, context) => {
      return await protect(context);
    },

    // MANAGER / HR
    employees: async (_, __, context) => {
      const user = await protect(context);
      authorizeRoles(user, ["MANAGER", "HR"]);

      return await User.find({ role: "EMPLOYEE" });
    },

    // EMPLOYEE
    myPerformance: async (_, __, context) => {
      const user = await protect(context);

      if (user.role !== "EMPLOYEE") {
        throw new Error("Only employees can view performance");
      }

      return await Performance.find({
        employee: user._id,
      })
        .populate("employee evaluator")
        .sort({ createdAt: -1 });
    },

    // HR / MANAGER
    employeePerformance: async (_, { employeeId }, context) => {
      const user = await protect(context);
      authorizeRoles(user, ["MANAGER", "HR"]);

      return await Performance.find({ employee: employeeId })
        .populate("employee evaluator")
        .sort({ createdAt: -1 });
    },

    // HR ONLY
    hrEmployeeOverview: async (_, __, context) => {
      const user = await protect(context);
      authorizeRoles(user, ["HR"]);

      const employees = await User.find({ role: "EMPLOYEE" });

      const result = [];

      for (let emp of employees) {
        const performance = await Performance.findOne({
          employee: emp._id,
        })
          .populate("employee evaluator")
          .sort({ createdAt: -1 });

        result.push({
          employee: emp,
          performance: performance || null,
        });
      }

      return result;
    },
  },

  Mutation: {
    // REGISTER
    register: async (_, { name, email, password, role, companyCode }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error("User already exists");

      if (
        (role === "HR" || role === "MANAGER") &&
        companyCode !== COMPANY_UNIQUE_CODE
      ) {
        throw new Error("Invalid Company Unique ID");
      }

      const user = await User.create({ name, email, password, role });

      return {
        token: generateToken(user._id),
        user,
      };
    },

    // LOGIN
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user || !(await user.matchPassword(password))) {
        throw new Error("Invalid email or password");
      }

      return {
        token: generateToken(user._id),
        user,
      };
    },

    // EVALUATE PERFORMANCE
    evaluatePerformance: async (
      _,
      { employeeId, rating, skillLevel, attendanceScore, currentSalary },
      context,
    ) => {
      const evaluator = await protect(context);
      authorizeRoles(evaluator, ["MANAGER", "HR"]);

      // NEW CHECK — prevent duplicate evaluation
      const existingPerformance = await Performance.findOne({
        employee: employeeId,
      });

      if (existingPerformance) {
        throw new Error("This employee has already been evaluated");
      }

      const hikePercentage = calculateHike(rating, skillLevel, attendanceScore);

      const performance = await Performance.create({
        employee: employeeId,
        evaluator: evaluator._id,
        rating,
        skillLevel,
        attendanceScore,
        currentSalary,
        hikePercentage,
        revisedSalary: currentSalary + (currentSalary * hikePercentage) / 100,
        promotionRecommendation: hikePercentage >= 15 ? "YES" : "NO",
      });

      return performance.populate("employee evaluator");
    },
  },
};

module.exports = resolvers;
