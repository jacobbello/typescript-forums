import { Category, CategoryNotFoundError, Database, IDType, Post, PostNotFoundError, Thread, ThreadNotFoundError, User, UserNotFoundError } from "./database";
import * as fs from 'fs'

export default class MemoryDatabase implements Database {
    users: Map<number, User> = new Map();
    categories: Map<number, Category> = new Map();
    threads: Map<number, Thread> = new Map();
    posts: Map<number, Post> = new Map();
    id: number = 0;
    load: boolean = false;

    constructor(load?: boolean) {
        if (load) this.load = true;
    }

    connect = async () => {
        if (this.load && fs.existsSync('db.tmp')) {
            let saved = JSON.parse(fs.readFileSync('db.tmp').toString());
            saved.users.forEach(u => this.users.set(u.id, u));
            saved.categories.forEach(u => this.categories.set(u.id, u));
            saved.threads.forEach(u => this.threads.set(u.id, u));
            saved.posts.forEach(u => this.posts.set(u.id, u));
            this.id = saved.id;
        }
    };
    save = async () => {
        if (this.load) {
            let serialized = JSON.stringify({
                users: Array.from(this.users.values()),
                categories: Array.from(this.categories.values()),
                threads: Array.from(this.threads.values()),
                posts: Array.from(this.posts.values()),
                id: this.id
            });
            fs.writeFileSync('db.tmp', serialized);
        }
    };
    disconnect = async() => {
        await this.save();
    }
    getUserById = async (id: number) => {
        if (!this.users.has(id))
            throw new UserNotFoundError(id);
        return this.users.get(id);
    };

    getUserByName = async (name: string) => {
        for (let user of this.users.values()) {
            if (user.username.toLowerCase() === name.toLowerCase()) return user;
        }
        throw new UserNotFoundError(name);
    }

    getUserByEmail = async (email: string) => {
        for (let user of this.users.values()) {
            if (user.email.toLowerCase() === email.toLowerCase()) return user;
        }
        throw new UserNotFoundError(email);
    }

    getNextId = async (type: IDType) => ++this.id;
    insertUser = async (user: User) => { this.users.set(user.id, user); await this.save();}
    getPosts = async (thread: number) => Array.from(this.posts.values()).filter(p => p.id == thread);
    getThreads = async (category: number) => Array.from(this.threads.values()).filter(t => t.id == category);
    getCategories = async () => Array.from(this.categories.values());
    getCategory = async (id: number) => {
        if (!this.categories.has(id)) throw new CategoryNotFoundError(id);
        return this.categories.get(id);
    }

    getThread = async (id: number) => {
        if (!this.threads.has(id)) throw new ThreadNotFoundError(id);
        return this.threads.get(id);
    };

    getPost = async (id: number) => {
        if (!this.posts.has(id)) throw new PostNotFoundError(id);
        return this.posts.get(id);
    }

    insertPost = async (post: Post) => {this.posts.set(post.id, post);await this.save();}
    insertThread = async (t: Thread) => {this.threads.set(t.id, t); await this.save();}
    insertCategory = async(category: Category) => {this.categories.set(category.id, category); await this.save();}
    deletePost = async (id: number) => {this.posts.delete(id); await this.save();}
    deleteThread = async (id: number) => {this.threads.delete(id); await this.save();}
    deleteCategory = async (id: number) => {this.categories.delete(id); await this.save();}
}