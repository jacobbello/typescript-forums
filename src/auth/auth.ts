import { User, getDatabase, Database } from "../database/database";
import {hash, compare} from "bcrypt";

let db: Database;

export function login(username: string, password: string): Promise<User> {
  db = getDatabase();
  return new Promise<User>((resolve, reject) => {
    db.getUserByName(username).then((u: User) => {
      compare(password, u.password).then((result: boolean) => {
        if (result) resolve(u);
        else reject('Invalid login');
      }).catch(reject);
    }).catch(reject);
  });
}

export function register(username: string, password: string, email: string): Promise<User> {
  db = getDatabase();
  return new Promise<User>((resolve, reject) => {
    db.getUserByName(username).then((u: User) => {
      reject('User already exists');
    }).catch((reason: any) => {
      if (reason == 'User does not exist') {
        hash(password, 10).then((hash: string) => {
          db.getNextId('user').then((id) => {
            let user: User = {
              username: username,
              password: hash,
              email: email,
              id: id
            } as User;
            db.insertUser(user).then(() => {
              resolve(user);
            }).catch(reject);
          }).catch(reject);
        }).catch(reject);
      } else reject(reason);
    });
  });
}
