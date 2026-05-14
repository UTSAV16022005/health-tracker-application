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

const corsOptions = {
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

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
    res.json({ 
        status: "Server is running", 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Error handling middleware - improved logging
app.use((err, req, res, next) => {
    console.error('=== ERROR OCCURRED ===');
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    console.error('Path:', req.path);
    console.error('Method:', req.method);
    console.error('=== END ERROR ===');
    
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ 
        error: err.message || "Something went wrong!",
        status: statusCode
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found", path: req.path });
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