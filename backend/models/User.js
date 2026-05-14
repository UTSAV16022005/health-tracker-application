const { getDb } = require("../connect");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const User = {
    // Create a new user
    async create(userData) {
        const db = getDb();
        const collection = db.collection("users");

        // Validate email
        if (!validator.isEmail(userData.email)) {
            throw new Error("Invalid email format");
        }

        // Check if user exists
        const existingUser = await collection.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error("User already exists with this email");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const user = {
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            age: userData.age || null,
            gender: userData.gender || null,
            height: userData.height || null,
            targetWeight: userData.targetWeight || null,
            dailyCalorieGoal: userData.dailyCalorieGoal || 2000,
            dailyWaterGoal: userData.dailyWaterGoal || 2000,
            dailyStepsGoal: userData.dailyStepsGoal || 10000,
            isAdmin: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await collection.insertOne(user);
        user._id = result.insertedId;
        delete user.password;
        console.log(`[USER_MODEL] User created successfully: ${user.email}`);
        return user;
    },

    // Find user by email
    async findByEmail(email) {
        const db = getDb();
        const collection = db.collection("users");
        return await collection.findOne({ email });
    },

    // Find user by ID
    async findById(userId) {
        const db = getDb();
        const collection = db.collection("users");
        const { ObjectId } = require("mongodb");
        return await collection.findOne({ _id: new ObjectId(userId) });
    },

    // Update user profile
    async updateProfile(userId, updateData) {
        const db = getDb();
        const collection = db.collection("users");
        const { ObjectId } = require("mongodb");

        const updates = {
            name: updateData.name,
            age: updateData.age,
            gender: updateData.gender,
            height: updateData.height,
            targetWeight: updateData.targetWeight,
            dailyCalorieGoal: updateData.dailyCalorieGoal,
            dailyWaterGoal: updateData.dailyWaterGoal,
            dailyStepsGoal: updateData.dailyStepsGoal,
            updatedAt: new Date()
        };

        // Remove undefined fields
        Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { $set: updates },
            { returnDocument: "after" }
        );

        if (!result.value) throw new Error("User not found");
        delete result.value.password;
        return result.value;
    },

    // Change password
    async changePassword(userId, oldPassword, newPassword) {
        const db = getDb();
        const collection = db.collection("users");
        const { ObjectId } = require("mongodb");

        const user = await collection.findOne({ _id: new ObjectId(userId) });
        if (!user) throw new Error("User not found");

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) throw new Error("Incorrect password");

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await collection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { password: hashedPassword, updatedAt: new Date() } }
        );

        return { message: "Password changed successfully" };
    },

    // Reset password
    async resetPassword(email, newPassword) {
        const db = getDb();
        const collection = db.collection("users");

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const result = await collection.findOneAndUpdate(
            { email },
            { $set: { password: hashedPassword, updatedAt: new Date() } },
            { returnDocument: "after" }
        );

        if (!result.value) throw new Error("User not found");
        delete result.value.password;
        return result.value;
    },

    // Get all users (admin)
    async getAll() {
        const db = getDb();
        const collection = db.collection("users");
        const users = await collection.find({}).project({ password: 0 }).toArray();
        return users;
    },

    // Delete user
    async delete(userId) {
        const db = getDb();
        const collection = db.collection("users");
        const { ObjectId } = require("mongodb");

        await collection.deleteOne({ _id: new ObjectId(userId) });
        return { message: "User deleted successfully" };
    },

    // Verify password
    async verifyPassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
};

module.exports = User;
