import { Category, CategoryNotFoundError, Database, IDType, Post, PostNotFoundError, Thread, ThreadNotFoundError, User, UserNotFoundError } from "./database";
import * as mysql from "mysql2";
import * as util from "util";

let setupQueries = [
    `CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username varchar(30),
        password varchar(64),
        email varchar(80),
        date datetime,
        auth INT)`,
    `CREATE TABLE IF NOT EXISTS categories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name varchar(200),
        description text
    )`,
    `CREATE TABLE IF NOT EXISTS threads (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title varchar(200),
        category INT,
        author INT,
        FOREIGN KEY (category) REFERENCES categories(id),
        FOREIGN KEY (author) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS posts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        content MEDIUMTEXT,
        thread INT,
        author INT,
        date datetime,
        FOREIGN KEY (thread) REFERENCES threads(id),
        FOREIGN KEY (author) REFERENCES users(id)
    )`
]

/**
 * Implementation of {Database} using MySQL
 */
export default class MySQLDatabase implements Database {
    options: mysql.PoolOptions;
    con: mysql.Pool;

    /**
     * Initialize MySQL database
     * @param options see {@link mysql.createPool}
     */
    constructor(options: mysql.PoolOptions) {
        this.options = options;
    }

    /**
     * Wrapper for this.con.query using promises
     */
    async query(query: string, values?: any) {
        if (typeof values == undefined) values = [];
        if (typeof this.con == undefined) this.con = mysql.createPool(this.options);
        return new Promise<any>((resolve, reject) => this.con.query(query, values, (e, r) => {
            if (e) reject(e);
            else resolve(r);
        }));
    }

    connect = async () => {
        this.con = mysql.createPool(this.options);
        // .then() clause prevents compiler from complaining about typecast
        return Promise.all(setupQueries.map(q => this.query(q))).then(() => {});
    }

    disconnect = () => {
        return new Promise<void>((resolve, reject) => {
            this.con.end((e) => {
                if (e) reject(e);
                else resolve();
            });
        });
    }

    async userQuery(q: string, param: any) {
        let r = await this.query(q, [param]) as User[];
        if (r.length == 0) throw new UserNotFoundError(param);
        return r[0] as User;
    }

    getUserById = (id: number) =>
        this.userQuery('SELECT * FROM users WHERE id=?', id);

    getUserByEmail = (email: string) =>
        this.userQuery('SELECT * FROM users WHERE email=?', email);

    getUserByName = (username: string) =>
        this.userQuery('SELECT * FROM users WHERE username=?', username);

    async insertUser(user: User) {
        let r = await this.query('INSERT INTO users (username, password, email, date, auth) VALUES (?,?,?,now(), ?)',
        [user.username, user.password, user.email, user.auth]);
        user.id = r.insertId;
        return user;
    };

    deleteUser = async (id: number) => {
        let r = await this.query('DELETE FROM users WHERE id=?', [id]);
        if (r.affectedRows == 0) throw new UserNotFoundError(id);
    }

    getPosts = (thread: number) =>
        this.query('SELECT * FROM posts WHERE thread=?',
            [thread]) as Promise<Post[]>;

    getThreads = (category: number) =>
        this.query('SELECT * FROM threads WHERE category=?',
            [category]) as Promise<Thread[]>;

    getCategories = () =>
        this.query('SELECT * FROM categories') as Promise<Category[]>;

    async getCategory(id: number) {
        let r = await this.query('SELECT * FROM categories WHERE id=?',
         [id]) as Category[];
        if (r.length == 0) throw new CategoryNotFoundError(id);
        return r[0];
    };

    async getThread(id: number) {
        let r = await this.query('SELECT * FROM threads WHERE id=?', [id]) as Thread[];
        if (r.length == 0) throw new ThreadNotFoundError(id);
        return r[0];
    }

    async getPost(id: number) {
        let r = await this.query('SELECT * FROM posts WHERE id=?', [id]) as Post[];
        if (r.length == 0) throw new PostNotFoundError(id);
        return r[0];
    }

    async insertPost(post: Post) {
        let r = await this.query('INSERT INTO posts SET ?', [post]);
        post.id = r.insertId;
        return post;
    }

    async insertThread(thread: Thread) {
        let r = await this.query('INSERT INTO threads SET ?', [thread]);
        thread.id = r.insertId;
        return thread;
    }

    async insertCategory(category: Category) {
        let r = await this.query('INSERT INTO categories SET ?', [category]);
        category.id = r.insertId;
        return category;
    }

    deletePost = (id: number) => this.query('DELETE FROM posts WHERE id=?', [id]);
    deleteThread = (id: number) => this.query('DELETE FROM threads WHERE id=?', [id]);
    deleteCategory = (id: number) => this.query('DELETE FROM categories WHERE id=?', [id]);
}