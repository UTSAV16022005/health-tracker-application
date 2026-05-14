
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
        await client.connect();
        database = client.db("health-tracker");
        console.log("MongoDB connected to database: health-tracker");
    } catch (err) {
        console.error("MongoDB connection failed:", err);
        throw err;
    }
}

function getDb() {
    return database;
}

module.exports = {
    connectToServer,
    getDb,
};

