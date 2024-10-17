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
    const options = { sort: { _id: -1 }, };

    if (id) {
      query._id = id;
      return JSON.stringify(await collection.findOne(query, options));
    }

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

    // id based on last post id (auto increment-like)
    const options = { sort: { _id: -1 }, projection: { _id: 1 } };
    const lastPost = await collection.findOne({}, options);

    const time = new Date().toJSON();
    const formatedPost = {
      '_id': lastPost['_id'] + 1,
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

