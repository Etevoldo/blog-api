'use strict';

const connString = require('./credentials.js');
const { MongoClient } = require('mongodb');

const client = new MongoClient(connString);
// query either all (no argument) or an specific post
async function getPost(search) {
  try {
    await client.connect();
    const db = client.db('blog');
    const collection = db.collection('posts');

    let query = { };
    const options = { sort: { _id: -1 } };

    if ((typeof search) === 'number') { // id search
      query = { _id: search };
      const post = await collection.findOne(query, options);

      if (post === null) {
        return {code: 404, body: `Can't find post with id: ${search}`};
      }

      return {code: 200, body: JSON.stringify(post)};
    }
    else if ((typeof search) === 'string') { // wildcard search
      const re = new RegExp(search);
      query = {
        $or: [
          { title: { $regex: re }},
          { content: { $regex: re }},
          { category: { $regex: re }}
        ]
      };
    }

    const cursor = collection.find(query, options);
    const data = [];
    for await (const doc of cursor) data.push(doc);

    return {code: 200, body: JSON.stringify(data)};
  } finally {
    await client.close();
  }
}
/* insert a post, taking a Object as argument,
 * returning a formated version of the parameter
 * which is how the data was stored in the database.
 * throw a error code in case the object is bad or insertion failed */
async function insertPost(postToInsert) {
    // throw `400 Bad Request` on a bad post
    if (!isValidPost(postToInsert)) return {code: 400, body: formatTemplate};
  try {

    await client.connect();
    const db = client.db('blog');
    const collection = db.collection('posts');

    // id based on last post id (auto increment-like)
    const options = { sort: { _id: -1 }, projection: { _id: 1 } };
    const lastPost = await collection.findOne({}, options);

    const time = new Date();//.toJSON();
    const formatedPost = {
      '_id': lastPost['_id'] + 1,
      ...postToInsert,
      'createdAt': time,
      'updatedAt': time
    };
    const result = await collection.insertOne(formatedPost);

    if (!result.acknowledged) throw "Can't insert";
    return {code: 201, body: JSON.stringify(formatedPost)};

  } finally {
    await client.close();
  }
}

async function deletePost(id) {
  if (!id) return {code: 400, body: 'Specify an id to delete!'};

  try {
    await client.connect();
    const db = client.db('blog');
    const collection = db.collection('posts');

    const query = { _id: id };
    const result = await collection.deleteOne(query);

    if (result.deletedCount !== 1) {
      return {code: 404, body: `No post with "_id: ${id}" found to delete!`};
    }
    console.log(`Deleted post with "_id: ${id}" sucessfully`); //debug
    return {code: 204, body: ''};

  } finally {
    await client.close();
  }
}

async function updatePost(updatedPost, id) {
  // throw `400 Bad Request` on a bad post format to update
  if (!isValidPost(updatedPost)) return {code: 400, body: formatTemplate};
  if (!id) return {code: 400, body: 'Specify an id to delete!'};

  try {
    await client.connect();
    const db = client.db('blog');
    const collection = db.collection('posts');

    const filter = { "_id": id };
    const replacementDoc = [{
      $set: {
       "title": updatedPost.title,
       "content": updatedPost.content,
       "category": updatedPost.category,
       "tags": updatedPost.tags,
       "updatedAt": "$$NOW"
      }
    }];
    const result = await collection.updateOne(filter, replacementDoc);

    if (!result.acknowledged) throw "Can't insert";
    if (result.matchedCount < 1) {
      return {code: 404, body: `Can't find document with id: ${id}`};
    };

    return {code: 200, body: `Updated post ${id} with sucess`};

  } finally {
    await client.close();
  }
}

//helper functions and constants
const formatTemplate = `Incorrect post format, example:
{
"title": <string>,
"content": <string>,
"category": <string>,
"tags": <array of strings>
}
`;
function isValidPost(post) {
  if ((typeof post.title)    !== 'string') return false;
  if ((typeof post.content)  !== 'string') return false;
  if ((typeof post.category) !== 'string') return false;
  if ((typeof post.tags)     !== 'object') return false;

  return true;
}

module.exports = { getPost, insertPost, deletePost, updatePost };
