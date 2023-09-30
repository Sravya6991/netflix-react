const MongoClient = require("mongodb").MongoClient;
const MongoURL = "mongodb://127.0.0.1:27017";

let database;

async function connect() {
    const client = await MongoClient.connect(MongoURL);
    database = client.db("netflix-movie-api");
}

function getDb() {
    if(!database) {
        throw({message: "database connection not established"});
    } else {
        return database;
    }
}

module.exports = {
    connectToDb: connect,
    getDb: getDb
}
