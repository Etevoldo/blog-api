# What is this

Another [roadmap.sh](https://roadmap.sh/projects/blogging-platform-api) project, this one is a RESTful API, made with vanilla node HTTP functions, using mongoDB.
The instructions on how to use it are pretty much explained there

# How to run

1. clone the repo
2. install dependencies
```console
npm i
```
3. assuming you already have a mongodb account, create a cluster and create a `credentials.js` file inside src directory with the following template:
```js
const connString = `<your cluster-connection-string>`;

module.exports = connString;
```
4. start the application
```console
npm start
```

---

TODO: wildcard search query:
```console
GET /posts?term=tech
```
