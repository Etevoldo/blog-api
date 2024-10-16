'use strict';

const connString = require('./credentials.js');
const { MongoClient } = require('mongodb');

const client = new MongoClient(connString);
// query either all (no argument) or an specific post
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
/* insert a post, taking a Object as argument,
 * returning a formated version of the parameter
 * which is how the data was stored in the database.
 * throw a error code in case the object is bad or insertion failed */
async function insertPost(postToInsert) {
  try {
    //TODO: validate post to Insert before this step
    // and throw `400 Bad Request` on a bad post
    await client.connect();
    const db = client.db('blog');
    const collection = db.collection('posts');

    // id based on quantity, might change it later
    const postsCount = await collection.countDocuments();
    const time = new Date().toJSON();
    // add id to top
    const formatedPost = {
      'id': postsCount + 1,
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

