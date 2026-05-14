const connect = require("./connect");
const express = require("express");
const cors = require("cors");
const { authMiddleware } = require("./middleware/auth");

// Import routes
const authRoutes = require("./routes/authRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const mealRoutes = require("./routes/mealRoutes");
const waterRoutes = require("./routes/waterRoutes");
const sleepRoutes = require("./routes/sleepRoutes");
const weightRoutes = require("./routes/weightRoutes");
const activityRoutes = require("./routes/activityRoutes");

require("dotenv").config({ path: "./config.env" });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);

// Protected routes
app.use("/api/workouts", authMiddleware, workoutRoutes);
app.use("/api/meals", authMiddleware, mealRoutes);
app.use("/api/water", authMiddleware, waterRoutes);
app.use("/api/sleep", authMiddleware, sleepRoutes);
app.use("/api/weight", authMiddleware, weightRoutes);
app.use("/api/activity", authMiddleware, activityRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ status: "Server is running", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

async function startServer() {
    try {
        await connect.connectToServer();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to start server because MongoDB connection failed.", err);
        process.exit(1);
    }
}

startServer();