import {Database, User, Post, Thread, Category, DatabaseOptions} from './database';
import {MongoClient, FindAndModifyWriteOpResultObject} from 'mongodb';

export class Mongo implements Database {  deleteCategory: (id: number) => Promise<void>;
  connection: MongoClient;

  constructor(options: DatabaseOptions) {
    MongoClient.connect(options.url, options).then((db: MongoClient) => {
      this.connection = db;
    }).catch(console.error);
  }

  deleteThread(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let db= this.connection.db('forums');
      let threads = db.collection('threads');
      threads.deleteOne({id: id}).then(() => {
        let posts = db.collection('posts');
        posts.deleteMany({thread: id}).then(() => {
          resolve();
        }).catch(reject);
      }).catch(reject);
    });
  }

  deletePost(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let db= this.connection.db('forums');
      let posts = db.collection('posts');
      posts.deleteOne({id: id}).then(() => {
        resolve();
      }).catch(reject);
    });
  }

  insertCategory(category: Category): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let db = this.connection.db('forums');
      let categories = db.collection('categories');
      categories.insertOne(category).then(() => {
        resolve();
      }).catch(reject);
    });
  }

  insertThread(thread: Thread): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let db = this.connection.db('forums');
      let threads = db.collection('threads');
      threads.insertOne(thread).then(() => {
        let categories = db.collection('categories');
        categories.updateOne({id: thread.category}, {$addToSet: {threads: thread.id}}).then(() => {
          resolve();
        }).catch(reject);
      }).catch(reject);
    });
  }

  insertPost(post: Post): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let db = this.connection.db('forums');
      let posts = db.collection('posts');
      posts.insertOne(post).then(() => {
        let threads = db.collection('threads');
        threads.updateOne({id: post.thread}, {$addToSet: {posts: post.id}}).then(() => {
          resolve();
        }).catch(reject);
      });
    });
  }

  getCategories(): Promise<Category[]> {
    return new Promise<Category[]>((resolve, reject) => {
      let db = this.connection.db('forums');
      let categories = db.collection('categories');
      categories.find().toArray().then((results: any[]) => {
        if (results) resolve(results as Category[]);
        else reject('No categories found');
      }).catch(reject);
    });
  }

  getCategory(id: number): Promise<Category> {
    return new Promise<Category>((resolve, reject) => {
      let db = this.connection.db('forums');
      let categories = db.collection('categories');
      categories.findOne({id: id}).then((c: any) => {
        if (c) resolve(c as Category);
        else reject('Category not found');
      }).catch(reject);
    });
  }

  getThreads(ids: number[]): Promise<Thread[]> {
    return new Promise<Thread[]>((resolve, reject) => {
      let db = this.connection.db('forums');
      let threads = db.collection('threads');
      threads.find({id: {$in: ids}}).toArray().then((threads: any[]) => {
        if (threads) resolve(threads as Thread[]);
        else reject('Threads not found');
      }).catch(reject);
    });
  };

  getPosts(ids: number[]): Promise<Post[]> {
    return new Promise<Post[]>((resolve, reject) => {
      let db = this.connection.db('forums');
      let posts = db.collection('posts');
      posts.find({id: {$in: ids}}).toArray().then((posts: any[]) => {
        if (posts) resolve(posts as Post[]);
        else reject('Posts not found');
      }).catch(reject);
    });
  }

  insertUser(user: User): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let db = this.connection.db('forums');
      let users = db.collection('user');
      users.insertOne(user).then(() => {
        resolve();
      }).catch(reject);
    });
  }

  getNextId(type: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      let db = this.connection.db('forums');
      let ids = db.collection('ids');
      ids.findOneAndUpdate({type: type}, [{$inc: {current: 1}}, {upsert: true}]).then((result: FindAndModifyWriteOpResultObject) => {
        if (result.value && result.value.current) {
          resolve(result.value.current);
        } else reject('No result found');
      }).catch(reject);
    });
  }
  getUserByEmail(email: string): Promise<User> {
      return new Promise<User>((resolve, reject) => {
        let db = this.connection.db('forums');
        let users = db.collection('users');
        users.findOne({email: email}).then((u: any) => {
          if (u) resolve(u as User);
          else reject('User does not exist');
        });
      });
  }

  getUserById(id: number): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      let db = this.connection.db('forums');
      let users = db.collection('users');
      users.findOne({id: id}).then((u: any) => {
        if (u) resolve(u as User);
        else reject('User does not exist');
      }).catch(reject);
    });
  }

  getUsersById(ids: number[]): Promise<User[]> {
    return new Promise<User[]>((resolve, reject) => {
      let db = this.connection.db('forums');
      let users = db.collection('users');
      users.find({id: {$in: ids}}).toArray().then((users: any[]) => {
        resolve(users as User[]);
      }).catch(reject);
    });
  }

  getUserByName(name: string): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      let db = this.connection.db('forums');
      let users = db.collection('users');
      users.findOne({username: name}).then((u: any) => {
        if (u) resolve(u as User);
        else reject('User does not exist');
      }).catch(reject);
    });
  }
}
