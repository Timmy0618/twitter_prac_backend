const { MongoClient } = require("mongodb");
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = "mongodb://root:example@mongo:27017";
const client = new MongoClient(url);
client.connect();
// Database Name
const dbName = "test";
const db = client.db(dbName);
module.exports = db;
