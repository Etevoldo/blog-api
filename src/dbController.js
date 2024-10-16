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
      sort: { id: 1},
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
//db.insertPost(JSON.parse(body))
async function insertPost(postToInsert) {
  try {
    await client.connect();
    const db = client.db('blog');
    const collection = db.collection('posts');

    //TODO validate before this step postToInsert
    const postsCount = await collection.countDocuments();
    const time = new Date().toJSON();
    // add id to top
    const formatedPost = {
      'id': postsCount + 1, //id based on quantity
      ...postToInsert,
      'createdAt': time,
      'updatedAt': time
    };
    const result = await collection.insertOne(formatedPost);

    if (!result.acknowledged) throw "Can't insert";

    return JSON.stringify(formatedPost);

  } finally {
    await client.close();
  }
}

module.exports = { getPost, insertPost };

