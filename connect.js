const { MongoClient } = require('mongodb');
const config = require('./config.js');

// eslint-disable-next-line no-unused-vars
const { dbUrl } = config;

const client = new MongoClient(config.dbUrl);

async function connect() {
  // TODO: Database Connection
  try {
    await client.connect();
    const db = client.db('burger_queen'); // Reemplaza <NOMBRE_DB> por el nombre del db
    console.log("Conectada a la base de datos");
    return db;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { connect };

/*
ORIGINAL:
const config = require('./config');

// eslint-disable-next-line no-unused-vars
const { dbUrl } = config;

async function connect() {
  // TODO: Database Connection
}

module.exports = { connect };
*/