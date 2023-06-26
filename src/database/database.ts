export interface Database {
    //Should all return string 'User does not exist'
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    getUserById: (id: number) => Promise<User>;
    getUserByName: (name: string) => Promise<User>;
    getUserByEmail: (email: string) => Promise<User>;
    /*
    IDS should start at 1
    categories, threads, posts, users,
    */
    getNextId: (type: IDType) => Promise<number>;
    insertUser: (user: User) => Promise<void>;

    getPosts: (thread: number) => Promise<Post[]>;
    getThreads: (category: number) => Promise<Thread[]>;
    getCategories: () => Promise<Category[]>;

    getCategory: (id: number) => Promise<Category>;
    getThread: (id: number) => Promise<Thread>;
    getPost: (id: number) => Promise<Post>;

    insertPost: (post: Post) => Promise<void>;
    insertThread: (thread: Thread) => Promise<void>;
    insertCategory: (category: Category) => Promise<void>;

    deletePost: (id: number) => Promise<void>;
    deleteThread: (id: number) => Promise<void>;
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
  authentication: number;
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
