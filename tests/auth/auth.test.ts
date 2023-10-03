import { InvalidLoginError, UserExistsError, login, register } from "../../src/auth/auth";
import { Database, setDatabase } from "../../src/database/database";
import MemoryDatabase from "../../src/database/memory";

const testUser = {
    username: 'test_user',
    email: 'test@email.com',
    id: 4,
    password: 'test',
    auth: 0
};

let db = new MemoryDatabase();

describe('auth', () => {
    beforeAll(async () => {
        setDatabase(db as Database);
        await db.connect();
        await db.insertUser(testUser);
    });
    test.each([
        ['username', testUser.username, 'aowipjrpoaiwj@mail.com'],
        ['email', 'oaioiwpir', testUser.email]
    ])('register existing %s throws error', async (t, username, email) => {
        expect.assertions(1);
        try {
            await register(username, 'password', email);
        } catch(e) {
            expect(e).toBeInstanceOf(UserExistsError);
        }
    });
    test('login fake account throws error', async() => {
        expect.assertions(1);
        try {
            await login('aoiuwjr', 'awer');
        } catch(e) {
            expect(e).toBeInstanceOf(InvalidLoginError);
        }
    });
    test('register and login to new account', async() => {
        expect.assertions(4);
        const username = 'testing';
        const password = 'password123';
        const email = 'bob@smith.com';
        let user = await register(username, password, email);
        expect(user.email).toEqual(email);
        expect(user.username).toEqual(username);
        let loggedIn = await login(username, password);
        expect(user).toEqual(loggedIn);
        try {
            await login(username, 'fake_password');
        } catch(e) {
            expect(e).toBeInstanceOf(InvalidLoginError);
        }
    });
    afterAll(async() => await db.disconnect());
});