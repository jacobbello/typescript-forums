/**
 * Represents a database holding user and forum data
 * @interface Database
 */
export interface Database {
    /**
     * Connects to the database
     * @returns {Promise<void>}
     */
    connect: () => Promise<void>;
    /**
     * Closes the active database connection
     * @returns {Promise<void>}
     */
    disconnect: () => Promise<void>;
    /**
     * 
     * @param id User ID
     * @returns {Promise<User>} 
     * @throws {UserNotFoundError}
     */
    getUserById: (id: number) => Promise<User>;
    /**
     * 
     * @param name Username
     * @returns {Promise<User>} 
     * @throws {UserNotFoundError}
     */
    getUserByName: (name: string) => Promise<User>;
    /**
     * 
     * @param email User email
     * @returns {Promise<User>} 
     * @throws {UserNotFoundError}
     */
    getUserByEmail: (email: string) => Promise<User>;
    /**
     * Save a user to the database. Should generate ID
     * @param user user to insert
     * @returns {Promise<void>}
     */
    insertUser: (user: User) => Promise<User>;

    /**
     * Delete a user from database
     * @throws {UserNotFoundError}
     * @param id Id of user to delete
     * @returns {Promise<void>}
     */
    deleteUser: (id: number) => Promise<void>;

    /**
     * Fetch all posts in the given thread
     * @param thread thread ID
     * @returns {Promise<Post[]>} list of posts in thread
     */
    getPosts: (thread: number) => Promise<Post[]>;
    /**
     * Fetch all threads in the given category
     * @param category category ID
     * @returns {Promise<Thread>} list of threads in category
     */
    getThreads: (category: number) => Promise<Thread[]>;
    /**
     * Fetch all categories
     * @returns {Promise<Category[]>} list of categories
     */
    getCategories: () => Promise<Category[]>;
    /**
     * Look up a category
     * @param id category id
     * @returns {Promise<Category>}
     * @throws {CategoryNotFoundError}
     */
    getCategory: (id: number) => Promise<Category>;
    /**
     * Look up a thread
     * @param id thread id
     * @returns {Promise<Thread>}
     * @throws {ThreadNotFoundError}
     */
    getThread: (id: number) => Promise<Thread>;
    /**
     * Look up a post
     * @param id post id
     * @returns {Promise<Post>}
     * @throws {PostNotFoundError}
     */
    getPost: (id: number) => Promise<Post>;
    /**
     * Save a post into the database
     * @param post Post to insert
     * @returns {Promise<void>}
     */
    insertPost: (post: Post) => Promise<Post>;
    /**
     * Save a thread into the database
     * @param thread Thread to insert
     * @returns {Promise<void>}
     */
    insertThread: (thread: Thread) => Promise<Thread>;
    /**
     * Save a category into the database
     * @param category Category to insert
     * @returns {Promise<void>}
     */
    insertCategory: (category: Category) => Promise<Category>;
    /**
     * Delete a post from the database
     * @param id ID of post to delete
     * @returns {Promise<void>}
     */
    deletePost: (id: number) => Promise<void>;
    /**
     * Delete a thread from the database
     * @param id ID of thread to delete
     * @returns {Promise<void>}
     */
    deleteThread: (id: number) => Promise<void>;
    /**
     * Delete a category from the database
     * @param id ID of category to delete
     * @returns {Promise<void>}
     */
    deleteCategory: (id: number) => Promise<void>;
}

export type IDType = 'user' | 'category' | 'post' | 'thread';

export class UserNotFoundError extends Error {
  constructor(query: any) {
    super(`User not found: ${query}`);
  }
}

export class CategoryNotFoundError extends Error {
  constructor(query: any) {
    super(`Category not found: ${query}`)
  }
}

export class ThreadNotFoundError extends Error {
  constructor(query: any) {
    super(`Thread not found: ${query}`)
  }
}

export class PostNotFoundError extends Error {
  constructor(query: any) {
    super(`Post not found: ${query}`)
  }
}

export interface User {
  username: string;
  password: string;
  email: string;
  id: number;
  auth: number;
}

export interface Post {
  content: string;
  id: number;
  author: number;
  thread: number;
}

export interface Thread {
  id: number;
  author: number;
  category: number;
  title: string;
}

export interface Category {
  name: string;
  description: string;
  id: number;
}

let db: Database;

export function setDatabase(d: Database) {
  db = d;
}

export {db}
