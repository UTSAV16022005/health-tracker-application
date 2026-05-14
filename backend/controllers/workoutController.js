const Workout = require("../models/Workout");

const WorkoutController = {
    // Create workout
    async createWorkout(req, res) {
        try {
            const workout = await Workout.create(req.userId, req.body);
            res.status(201).json({ message: "Workout added successfully", workout });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Get workouts
    async getWorkouts(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const workouts = await Workout.getByUserId(req.userId, startDate, endDate);
            res.json({ workouts, total: workouts.length });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get single workout
    async getWorkout(req, res) {
        try {
            const workout = await Workout.getById(req.params.id);

            if (!workout) {
                return res.status(404).json({ error: "Workout not found" });
            }

            if (workout.userId.toString() !== req.userId) {
                return res.status(403).json({ error: "Unauthorized" });
            }

            res.json(workout);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update workout
    async updateWorkout(req, res) {
        try {
            const workout = await Workout.getById(req.params.id);

            if (!workout) {
                return res.status(404).json({ error: "Workout not found" });
            }

            if (workout.userId.toString() !== req.userId) {
                return res.status(403).json({ error: "Unauthorized" });
            }

            const updated = await Workout.update(req.params.id, req.body);
            res.json({ message: "Workout updated successfully", workout: updated });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Delete workout
    async deleteWorkout(req, res) {
        try {
            const workout = await Workout.getById(req.params.id);

            if (!workout) {
                return res.status(404).json({ error: "Workout not found" });
            }

            if (workout.userId.toString() !== req.userId) {
                return res.status(403).json({ error: "Unauthorized" });
            }

            await Workout.delete(req.params.id);
            res.json({ message: "Workout deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get weekly analytics
    async getWeeklyAnalytics(req, res) {
        try {
            const analytics = await Workout.getWeeklyAnalytics(req.userId);
            res.json(analytics);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = WorkoutController;
