require('dotenv').config({path: './config.env'});
const { MongoClient } = require('mongodb');

async function run() {
    const client = new MongoClient(process.env.ATLAS_URI);
    await client.connect();
    const db = client.db('health-tracker');
    const collection = db.collection('water_intake');
    const waters = await collection.find({ timestamp: { $type: 'string' } }).toArray();
    for (const w of waters) {
        await collection.updateOne({ _id: w._id }, { $set: { timestamp: new Date(w.timestamp) } });
    }
    console.log(`Updated ${waters.length} water entries`);
    await client.close();
}

run();
