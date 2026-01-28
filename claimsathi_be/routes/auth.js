const express = require("express"); // backend framework
const router = express.Router(); // organize APIs
const { z } = require("zod");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/user_tbl");

/* ================= REGISTER ================= */

// Zod validation schema
const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),

  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, {
      message: "Mobile number must be a valid 10-digit Indian number",
    }),

  email: z.string().email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

router.post("/register", async (req, res) => {
  try {
    // STEP A: Validate input
    const validatedData = registerSchema.parse(req.body);
    const { name, mobile, email, password } = validatedData;

    // STEP B: Check existing user (email OR mobile)
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email or mobile number",
      });
    }

    // STEP C: Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // STEP D: Save user
    const newUser = new User({
      name,
      mobile,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Account created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/* ================= LOGIN ================= */

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string(),
});

router.post("/login", async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
  { userId: user._id },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
    });

   
 
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
