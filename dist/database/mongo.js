"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class Mongo {
    constructor(options) {
        mongodb_1.MongoClient.connect(options.url, options).then((db) => {
            this.connection = db;
        }).catch(console.error);
    }
    deleteThread(id) {
        return new Promise((resolve, reject) => {
            let db = this.connection.db('forums');
            let threads = db.collection('threads');
            threads.deleteOne({ id: id }).then(() => {
                let posts = db.collection('posts');
                posts.deleteMany({ thread: id }).then(() => {
                    resolve();
                }).catch(reject);
            }).catch(reject);
        });
    }
    deletePost(id) {
        return new Promise((resolve, reject) => {
            let db = this.connection.db('forums');
            let posts = db.collection('posts');
            posts.deleteOne({ id: id }).then(() => {
                resolve();
            }).catch(reject);
        });
    }
    insertCategory(category) {
        return new Promise((resolve, reject) => {
            let db = this.connection.db('forums');
            let categories = db.collection('categories');
            categories.insertOne(category).then(() => {
                resolve();
            }).catch(reject);
        });
    }
    insertThread(thread) {
        return new Promise((resolve, reject) => {
            let db = this.connection.db('forums');
            let threads = db.collection('threads');
            threads.insertOne(thread).then(() => {
                let categories = db.collection('categories');
                categories.updateOne({ id: thread.category }, { $addToSet: { threads: thread.id } }).then(() => {
                    resolve();
                }).catch(reject);
            }).catch(reject);
        });
    }
    insertPost(post) {
        return new Promise((resolve, reject) => {
            let db = this.connection.db('forums');
            let posts = db.collection('posts');
            posts.insertOne(post).then(() => {
                let threads = db.collection('threads');
                threads.updateOne({ id: post.thread }, { $addToSet: { posts: post.id } }).then(() => {
                    resolve();
                }).catch(reject);
            });
        });
    }
    getCategories() {
        return new Promise((resolve, reject) => {
            let db = this.connection.db('forums');
            let categories = db.collection('categories');
            categories.find().toArray().then((results) => {
                if (results)
                    resolve(results);
                else
                    reject('No categories found');
            }).catch(reject);
        });
    }
    getCategory(id) {
        return new Promise((resolve, reject) => {
            let db = this.connection.db('forums');
            let categories = db.collection('categories');
            categories.findOne({ id: id }).then((c) => {
                if (c)
                    resolve(c);
                else
                    reject('Category not found');
            }).catch(reject);
        });
    }
    getThreads(ids) {
        return new Promise((resolve, reject) => {
            let db = this.connection.db('forums');
            let threads = db.collection('threads');
            threads.find({ id: { $in: ids } }).toArray().then((threads) => {
                if (threads)
                    resolve(threads);
                else
                    reject('Threads not found');
            }).catch(reject);
        });
    }
    ;
    getPosts(ids) {
        return new Promise((resolve, reject) => {
            let db = this.connection.db('forums');
            let posts = db.collection('posts');
            posts.find({ id: { $in: ids } }).toArray().then((posts) => {
                if (posts)
                    resolve(posts);
                else
                    reject('Posts not found');
            }).catch(reject);
        });
    }
    insertUser(user) {
        return new Promise((resolve, reject) => {
            let db = this.connection.db('forums');
            let users = db.collection('user');
            users.insertOne(user).then(() => {
                resolve();
            }).catch(reject);
        });
    }
    getNextId(type) {
        return new Promise((resolve, reject) => {
            let db = this.connection.db('forums');
            let ids = db.collection('ids');
            ids.findOneAndUpdate({ type: type }, [{ $inc: { current: 1 } }, { upsert: true }]).then((result) => {
                if (result.value && result.value.current) {
                    resolve(result.value.current);
                }
                else
                    reject('No result found');
            }).catch(reject);
        });
    }
    getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            let db = this.connection.db('forums');
            let users = db.collection('users');
            users.findOne({ email: email }).then((u) => {
                if (u)
                    resolve(u);
                else
                    reject('User does not exist');
            });
        });
    }
    getUserById(id) {
        return new Promise((resolve, reject) => {
            let db = this.connection.db('forums');
            let users = db.collection('users');
            users.findOne({ id: id }).then((u) => {
                if (u)
                    resolve(u);
                else
                    reject('User does not exist');
            }).catch(reject);
        });
    }
    getUsersById(ids) {
        return new Promise((resolve, reject) => {
            let db = this.connection.db('forums');
            let users = db.collection('users');
            users.find({ id: { $in: ids } }).toArray().then((users) => {
                resolve(users);
            }).catch(reject);
        });
    }
    getUserByName(name) {
        return new Promise((resolve, reject) => {
            let db = this.connection.db('forums');
            let users = db.collection('users');
            users.findOne({ username: name }).then((u) => {
                if (u)
                    resolve(u);
                else
                    reject('User does not exist');
            }).catch(reject);
        });
    }
}
exports.Mongo = Mongo;
//# sourceMappingURL=mongo.js.map