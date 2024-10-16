'use strict';

const connString = require('./credentials.js');
const { MongoClient } = require('mongodb');

const client = new MongoClient(connString);

async function getPost(id) {
  try {
    await client.connect();
    const db = client.db('blog');
    const collection = db.collection('posts');

    const query = { };
    const options = {
      projection: { _id: 0 }
    }
    if (id) query.id = id;

    const cursor = collection.find(query, options);
    const data = [];
    for await (const doc of cursor) {
      data.push(doc);
    }
    return JSON.stringify(data);
  } finally {
    await client.close();
  }
}

module.exports = { getPost };

