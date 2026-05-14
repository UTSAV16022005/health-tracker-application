
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config({path: "./config.env"})

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.ATLAS_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let database

async function connectToServer() {
    try {
        console.log("[MONGODB] Attempting to connect to MongoDB...");
        await client.connect();
        database = client.db("health-tracker");
        console.log("[MONGODB] ✅ Successfully connected to database: health-tracker");
        
        // Test the connection with ping
        await client.db("admin").command({ ping: 1 });
        console.log("[MONGODB] ✅ Ping successful - database is responsive");
        
    } catch (err) {
        console.error("[MONGODB] ❌ Connection failed:", err.message);
        console.error("[MONGODB] Stack:", err.stack);
        throw err;
    }
}

function getDb() {
    if (!database) {
        throw new Error("Database not initialized. Please connect to server first.");
    }
    return database;
}

module.exports = {
    connectToServer,
    getDb,
};

