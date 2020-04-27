export interface Database {
    //Should all return string 'User does not exist'
    getUserById: (id: number) => Promise<User>;
    getUsersById: (ids: number[]) => Promise<User[]>;
    getUserByName: (name: string) => Promise<User>;
    getUserByEmail: (email: string) => Promise<User>;
    /*
    IDS should start at 1
    categories, threads, posts, users,
    */
    getNextId: (type: string) => Promise<number>;
    insertUser: (user: User) => Promise<void>;

    getPosts: (ids: number[]) => Promise<Post[]>;
    getThreads: (ids: number[]) => Promise<Thread[]>;
    getCategory: (id: number) => Promise<Category>;
    getCategories: () => Promise<Category[]>;

    insertPost: (post: Post) => Promise<void>;
    insertThread: (thread: Thread) => Promise<void>;
    insertCategory: (category: Category) => Promise<void>;

    deletePost: (id: number) => Promise<void>;
    deleteThread: (id: number) => Promise<void>;
    deleteCategory: (id: number) => Promise<void>;
}

export interface DatabaseOptions {
  type: string,
  url: string,
  port: number,
  database: string,
  username: string,
  password: string,
  poolSize: number
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
  authorName: string;
  thread: number;
}

export interface Thread {
  authorName: string;
  id: number;
  author: number;
  category: number;
  title: string;
  posts: number[] //Array of post ids
}

export interface Category {
  name: string;
  description: string;
  threads: number[]; // Number of threads in category
  id: number;
}

let db: Database;

export function setDatabase(d: Database) {
  db = d;
}

export function getDatabase(): Database {
  return db;
}
