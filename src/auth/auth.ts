import { User, db, Database, UserNotFoundError } from "../database/database";
import {hash, compare} from "bcrypt";

export class InvalidLoginError extends Error {
  constructor() {
    super('Invalid login credentials')
  }
}

export class UserExistsError extends Error {
  constructor(query) {
    super(`User already exists: $(query)`);
  }
}

export async function login(username: string, password: string): Promise<User> {
  let user = await db.getUserByName(username);
  if (await compare(password, user.password)) return user;
  throw new InvalidLoginError();
}

export async function register(username: string, password: string, email: string): Promise<User> {
  try {
    let user = db.getUserByName(username);
    throw new UserExistsError(username);
  } catch(e) {
    if (!(e instanceof UserNotFoundError)) throw e;
  }

  try {
    let user = db.getUserByEmail(email);
    throw new UserExistsError(email);
  } catch(e) {
    if (!(e instanceof UserNotFoundError)) throw e;
  }

  let hashed = await hash(password, 10);
  let id = await db.getNextId('user');
  let user = {
    username: username,
    password: hashed,
    email: email,
    id: id,
    authentication: 0
  };
  await db.insertUser(user);
  return user;
}
