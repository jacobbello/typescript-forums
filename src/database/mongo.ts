import { Database, User, Post, Thread, Category, UserNotFoundError, CategoryNotFoundError, IDType, ThreadNotFoundError, PostNotFoundError } from './database';
import { MongoClient, FindAndModifyWriteOpResultObject } from 'mongodb';

/**
 * Implementation of {Database} using MongoDB
 */
export class MongoDatabase implements Database {
  connection: MongoClient;
  uri: string;

  /**
   * Initialize using given parameters
   * @param uri Connection URI
   */
  constructor(uri: string) {
    console.log(uri);
    this.uri = uri;
  }

  async connect() {
    this.connection = await MongoClient.connect(this.uri);
  }

  async disconnect() {
    await this.connection.close();
  }

  async deleteThread(id: number) {
    let db = this.connection.db('forums');
    await db.collection('threads').deleteOne({ id: id })
    await db.collection('posts').deleteMany({ thread: id });
  }

  async deleteCategory(id: number) {
    let db = this.connection.db('forums');
    let categories = db.collection('categories');
    await categories.deleteOne({ id: id });
    let threads = await db.collection('threads').find({ category: id }).toArray();
    for (const thread of threads) {
      await this.deleteThread(thread.id);
    }
  }

  async deletePost(id: number) {
    await this.connection.db('forums').collection('posts').deleteOne({ id: id });
  }

  async insertCategory(category: Category) {
    category.id = await this.getNextId('category');
    await this.connection.db('forums').collection('categories').insertOne(category);
  }

  async insertThread(thread: Thread) {
    let db = this.connection.db('forums');
    let threads = db.collection('threads');
    await threads.insertOne(thread);
    let categories = db.collection('categories');
    await categories.updateOne({ id: thread.category }, { $addToSet: { threads: thread.id } });
  }

  async insertPost(post: Post) {
    post.id = await this.getNextId('post');
    let db = this.connection.db('forums');
    let posts = db.collection('posts');
    await posts.insertOne(post);
    let threads = db.collection('threads');
    await threads.updateOne({ id: post.thread }, { $addToSet: { posts: post.id } });
  }

  async getCategories() {
    let db = this.connection.db('forums');
    return await db.collection('categories').find().toArray();
  }

  async getCategory(id: number) {
    let category = this.connection.db('forums').collection('categories').findOne({ id: id });
    if (!category) throw new CategoryNotFoundError(id);
    return category;
  }
  async getThread(id: number) {
    let thread = this.connection.db('forums').collection('threads').findOne({ id: id });
    if (!thread) throw new ThreadNotFoundError(id);
    return thread;
  }
  async getPost(id: number) {
    let post = this.connection.db('forums').collection('posts').findOne({ id: id });
    if (!post) throw new PostNotFoundError(id);
    return post;
  }

  async getThreads(category: number) {
    return await this.connection.db('forums').collection('threads').find({ id: { category: category } }).toArray();
  };

  async getPosts(thread: number) {
    return await this.connection.db('forums').collection('posts').find({ thread: thread }).toArray();
  }

  async insertUser(user: User) {
    user.id = await this.getNextId('user');
    await this.connection.db('forums').collection('user').insertOne(user);
  }

  async getNextId(type: IDType) {
    let res = await this.connection.db('forums').collection('ids').findOneAndUpdate({ type: type }, [{ $inc: { current: 1 } }, { upsert: true }]);
    return res.value.current;
  }

  // Helper function to lookup user
  async getUser(query: Object) {
    let user = await this.connection.db('forums').collection('users').findOne(query);
    if (!user) throw new UserNotFoundError(Object.values(query)[0]);
    return user;
  }

  getUserByEmail = (email: string) => this.getUser({email: email});
  getUserById = (id: number) => this.getUser({id: id});
  getUserByName = (name: string) => this.getUser({username: name})
}
