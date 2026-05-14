const express = require("express");
const AuthController = require("../controllers/authController");

const authRoutes = express.Router();

authRoutes.post("/register", AuthController.register);
authRoutes.post("/login", AuthController.login);
authRoutes.post("/forgot-password", AuthController.forgotPassword);
authRoutes.post("/reset-password", AuthController.resetPassword);

// Protected routes
authRoutes.use((req, res, next) => {
    const { authMiddleware } = require("../middleware/auth");
    authMiddleware(req, res, next);
});

authRoutes.get("/profile", AuthController.getProfile);
authRoutes.put("/profile", AuthController.updateProfile);
authRoutes.post("/change-password", AuthController.changePassword);

module.exports = authRoutes;
