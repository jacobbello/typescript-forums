import { Database, UserNotFoundError, User, CategoryNotFoundError, ThreadNotFoundError, PostNotFoundError } from "../../src/database/database";
import MemoryDatabase from "../../src/database/memory";

let databases = [
    { db: new MemoryDatabase(), type: 'Memory'}
];

const testUser = {
    username: 'test_user',
    email: 'test@email.com',
    id: 4,
    password: 'test',
    authentication: 0
};

const testCategory = {
    name: 'Test Category',
    description: 'Category description',
    id: 3
};

const testThread = {
    title: 'Test Thread',
    category: 3,
    id: 4,
    author: 6
}

const testPost = {
    content: 'Test post body',
    id: 5,
    author: 6,
    thread: 4
}

describe('testing databases', () => {
    describe.each(databases)('testing $type database', ({ db, type }) => {
        beforeAll(async () => await db.connect());
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
                expect(e).toBeInstanceOf(error);
            }
        });

        describe('insert/retrieve user', () => {
            beforeAll(async () => await db.insertUser(testUser));
            it.each([
                { func: 'getUserByName', prop: 'username' },
                { func: 'getUserById', prop: 'id' },
                { func: 'getUserByEmail', prop: 'email' }])('test $func', async ({ func, prop }) => {
                    const user = await db[func](testUser[prop]);
                    expect(user).toEqual(testUser);
                });
        });

        describe.each([
            { name: 'category', insert: db.insertCategory, get: db.getCategory, del: db.deleteCategory, obj: testCategory },
            { name: 'thread', insert: db.insertThread, get: db.getThread, del: db.deleteThread, obj: testThread },
            { name: 'post', insert: db.insertPost, get: db.getPost, del: db.deletePost, obj: testPost }
        ])('insert $name', ({name, insert, get, del, obj}) => {
            beforeAll(async () => await (insert as (o) => Promise<void>)(obj));
            it('should find by id', async () => {
                expect(await get(obj.id)).toEqual(obj);
            });
            afterAll(async () => await del(obj.id));
        });

        describe.each([{
            name: 'category',
            insert: db.insertCategory,
            del: db.deleteCategory,
            get: db.getCategory,
            err: CategoryNotFoundError,
            obj: testCategory,
        }, {
            name: 'thread',
            insert: db.insertThread,
            del: db.deleteThread,
            get: db.getThread,
            err: ThreadNotFoundError,
            obj: testThread,
        }, {
            name: 'post',
            insert: db.insertPost,
            del: db.deletePost,
            get: db.getPost,
            err: PostNotFoundError,
            obj: testPost,
        }])('delete $name', ({ name, insert, del, get, err, obj }) => {
            it('should not exist after deleting', async () => {
                expect.assertions(1);
                await (insert as (o) => Promise<void>)(obj);
                await del(obj.id);
                try {
                    await get(obj.id);
                } catch (e) {
                    expect(e).toBeInstanceOf(err);
                }
            });
        });
    });
});