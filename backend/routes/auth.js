const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// ========================================
// REGISTER
// POST /api/auth/register
// ========================================

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // Convert email to lowercase
    const cleanEmail = email.toLowerCase().trim();

    // Check existing user
    const exists = await User.findOne({
      email: cleanEmail,
    });

    if (exists) {
      return res.status(400).json({
        message: "Email already used",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
    });

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      message: "Registration successful",

      token,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Register Error:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// ========================================
// LOGIN
// POST /api/auth/login
// ========================================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful",

      token,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// ========================================
// CURRENT USER
// GET /api/auth/me
// ========================================

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (err) {
    console.error("Me Error:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;