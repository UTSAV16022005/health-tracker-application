const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = require("../middleware/auth");

const AuthController = {
    // Register new user
    async register(req, res) {
        try {
            const { name, email, password, confirmPassword } = req.body;

            // Validate inputs
            if (!name || !email || !password) {
                return res.status(400).json({ error: "All fields are required" });
            }

            if (password !== confirmPassword) {
                return res.status(400).json({ error: "Passwords do not match" });
            }

            if (password.length < 6) {
                return res.status(400).json({ error: "Password must be at least 6 characters" });
            }

            console.log(`[REGISTER] Attempting to register user: ${email}`);
            const user = await User.create({ name, email, password });
            console.log(`[REGISTER] User registered successfully: ${email}`);

            // Generate JWT token
            const token = jwt.sign(
                { userId: user._id.toString(), email: user.email, isAdmin: user.isAdmin },
                JWT_SECRET,
                { expiresIn: "7d" }
            );

            res.status(201).json({
                message: "User registered successfully",
                token,
                user
            });
        } catch (error) {
            console.error(`[REGISTER ERROR] ${error.message}`);
            res.status(400).json({ error: error.message });
        }
    },

    // Login user
    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: "Email and password required" });
            }

            console.log(`[LOGIN] Attempting to login user: ${email}`);
            const user = await User.findByEmail(email);

            if (!user) {
                console.log(`[LOGIN ERROR] User not found: ${email}`);
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const isPasswordValid = await User.verifyPassword(password, user.password);

            if (!isPasswordValid) {
                console.log(`[LOGIN ERROR] Invalid password for user: ${email}`);
                return res.status(401).json({ error: "Invalid credentials" });
            }

            console.log(`[LOGIN] User logged in successfully: ${email}`);

            // Generate JWT token
            const token = jwt.sign(
                { userId: user._id.toString(), email: user.email, isAdmin: user.isAdmin },
                JWT_SECRET,
                { expiresIn: "7d" }
            );

            delete user.password;

            res.json({
                message: "Login successful",
                token,
                user
            });
        } catch (error) {
            console.error(`[LOGIN ERROR] ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    },

    // Get current user profile
    async getProfile(req, res) {
        try {
            const user = await User.findById(req.userId);

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            delete user.password;
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update profile
    async updateProfile(req, res) {
        try {
            const user = await User.updateProfile(req.userId, req.body);
            res.json({ message: "Profile updated successfully", user });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Change password
    async changePassword(req, res) {
        try {
            const { oldPassword, newPassword, confirmPassword } = req.body;

            if (!oldPassword || !newPassword || !confirmPassword) {
                return res.status(400).json({ error: "All fields are required" });
            }

            if (newPassword !== confirmPassword) {
                return res.status(400).json({ error: "New passwords do not match" });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({ error: "Password must be at least 6 characters" });
            }

            const result = await User.changePassword(req.userId, oldPassword, newPassword);
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Forgot password (returns reset token - in production, send via email)
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ error: "Email is required" });
            }

            const user = await User.findByEmail(email);

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            // In production: send reset link via email
            // For now, return a token that can be used to reset
            const resetToken = jwt.sign(
                { userId: user._id.toString(), email: user.email },
                JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.json({
                message: "Password reset token generated",
                resetToken,
                instruction: "Use this token within 1 hour to reset your password"
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Reset password
    async resetPassword(req, res) {
        try {
            const { token, newPassword, confirmPassword } = req.body;

            if (!token || !newPassword || !confirmPassword) {
                return res.status(400).json({ error: "Token and new password required" });
            }

            if (newPassword !== confirmPassword) {
                return res.status(400).json({ error: "Passwords do not match" });
            }

            const decoded = jwt.verify(token, JWT_SECRET);

            await User.resetPassword(decoded.email, newPassword);

            res.json({ message: "Password reset successfully" });
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(400).json({ error: "Reset token has expired" });
            }
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = AuthController;
