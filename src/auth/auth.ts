import { User, db, UserNotFoundError } from "../database/database";
import { hash, compare } from "bcrypt";

/** Thrown on failed login */
export class InvalidLoginError extends Error {
  constructor() {
    super('Invalid login credentials')
  }
}
/** Thrown when trying to register an existing user */
export class UserExistsError extends Error {
  constructor(query) {
    super(`User already exists: $(query)`);
  }
}

/**
 * Checks a given username/password combination and looks up user
 * @param username Username to login with
 * @param password Password to login with
 * @returns {Promise<User>} the user logging in
 * @throws {UserNotFoundError} if no user exists with username
 * @throws {InvalidLoginError} if password does not match
 */
export async function login(username: string, password: string): Promise<User> {
  try {
    let user = await db.getUserByName(username);
    if (await compare(password, user.password)) return user;
  } catch(e) {
    if (!(e instanceof UserNotFoundError)) throw e;
  }
  
  throw new InvalidLoginError();
}

/**
 * Checks a given email/password combination and looks up user
 * @param email Email to login with
 * @param password Password to login with
 * @returns {Promise<User>} the user loggin in
 * @throws {UserNotFoundError} if no user exists with email
 * @throws {InvalidLoginError} if password does not match
 */
export async function loginEmail(email: string, password: string): Promise<User> {
  let user = await db.getUserByEmail(email);
  if (await compare(password, user.password)) return user;
  throw new InvalidLoginError();
}

/**
 * Creates an account and saves it in the database
 * @param username Desired username
 * @param password Desired password
 * @param email Desired email
 * @returns {Promise<User>} inserted user
 * @throws {UserExistsError} if email or username is already taken
 */
export async function register(username: string, password: string, email: string): Promise<User> {
  try {
    let user = await db.getUserByName(username);
    throw new UserExistsError(username);
  } catch (e) {
    if (!(e instanceof UserNotFoundError)) throw e;
  }

  try {
    let user = await db.getUserByEmail(email);
    throw new UserExistsError(email);
  } catch (e) {
    if (!(e instanceof UserNotFoundError)) throw e;
  }

  let hashed = await hash(password, 10);
  let user = {
    username: username,
    password: hashed,
    email: email,
    auth: 0,
    id: -1
  };
  await db.insertUser(user);
  return user;
}
