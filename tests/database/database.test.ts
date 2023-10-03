import { Database, UserNotFoundError, User, CategoryNotFoundError, ThreadNotFoundError, PostNotFoundError, Thread, Post, Category } from "../../src/database/database";
import MemoryDatabase from "../../src/database/memory";
import MySQLDatabase from "../../src/database/mysql";

let databases = [/*
    { db: new MemoryDatabase(), type: 'Memory'},*/
    {
        db: new MySQLDatabase({
            user: 'forums',
            password: '',
            host: '192.168.1.159', // WSL IP address
            database: 'forum_test',
        }), type: 'MySQL'
    }
];

const testUser = {
    username: 'test_user',
    email: 'test@email.com',
    password: 'test',
    auth: 0
} as User;

const testCategory = {
    name: 'Test Category',
    description: 'Category description'
} as Category;

const testThread = {
    title: 'Test Thread',
} as Thread;

const testPost = {
    content: 'Test post body'
} as Post;

describe('testing databases', () => {
    describe.each(databases)('testing $type database', ({ db, type }) => {
        beforeAll(async () => await db.connect());
        afterAll(async () => await db.disconnect());
        const errors = [
            {
                name: 'getUserByName',
                query: 'fake_username',
                error: UserNotFoundError
            },
            {
                name: 'getUserByEmail',
                query: 'fake_email',
                error: UserNotFoundError
            },
            {
                name: 'getUserById',
                query: 12345678,
                error: UserNotFoundError
            },
            {
                name: 'getCategory',
                query: 12345678,
                error: CategoryNotFoundError
            },
            {
                name: 'getThread',
                query: 12345678,
                error: ThreadNotFoundError
            },
            {
                name: 'getPost',
                query: 12345678,
                error: PostNotFoundError
            }
        ];
        it.each(errors)('$name($query) throws $error', async ({ name, query, error }) => {
            expect.assertions(1);
            try {
                await db[name](query);
            } catch (e) {
                if (!(e instanceof error)) console.error(error);
                expect(e).toBeInstanceOf(error);
            }
        });

        describe('insert/retrieve user', () => {
            beforeAll(async () => {
                await db.insertUser(testUser);
            });
            it.each([
                { func: 'getUserByName', prop: 'username' },
                { func: 'getUserById', prop: 'id' },
                { func: 'getUserByEmail', prop: 'email' }])('test $func', async ({ func, prop }) => {
                    const user = await db[func](testUser[prop]);
                    expect(user.username).toEqual(testUser.username);
                    expect(user.email).toEqual(testUser.email);
                    expect(user.password).toEqual(testUser.password);
                    expect(user.auth).toEqual(testUser.auth);
                });
            afterAll(async () => await db.deleteUser(testUser.id));
        });

        describe('content tests', () => {
            // Inserted content
            var c: Category;
            var t: Thread;
            var p: Post;
            var u: User;
            /*
            Inserting needs to be done in order so that the ID's can be specified
            */
            beforeAll(async () => {
                u = await db.insertUser(testUser);
                testPost.author = u.id;
                testThread.author = u.id;

                c = await db.insertCategory(testCategory);
                expect(c.id).not.toBe(-1);
                testThread.category = c.id;

                t = await db.insertThread(testThread);
                expect(t.id).not.toBe(-1);
                testPost.thread = t.id;

                p = await db.insertPost(testPost);
                expect(p.id).not.toBe(-1);
            });

            test('inserted category matches', async () => {
                let cat = await db.getCategory(c.id);
                expect(cat.name).toEqual(testCategory.name);
                expect(cat.description).toEqual(testCategory.description);
            });

            test('inserted thread matches', async () => {
                let thread = await db.getThread(t.id);
                expect(thread.author).toEqual(u.id);
                expect(thread.category).toEqual(c.id);
                expect(thread.title).toEqual(testThread.title);
            });

            test('inserted post matches', async () => {
                let post = await db.getPost(p.id);
                expect(post.author).toEqual(u.id);
                expect(post.thread).toEqual(t.id);
                expect(post.content).toEqual(testPost.content);
            });

            afterAll(async () => {
                await db.deletePost(p.id);
                await db.deleteThread(t.id);
                await db.deleteCategory(c.id);
                await db.deleteUser(testUser.id);
            });
        });
    });
});