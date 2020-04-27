import { Database, User, Category, Thread, Post } from "./database";

interface ObjectID {
  id: number;
}

export default class MemoryDatabase implements Database {
  userList: User[];
  categoryList: Category[];
  threadList: Thread[];
  postList: Post[];
  nextID: number;

  constructor() {
    this.nextID = 1;
    this.userList = [];
    this.categoryList = [];
    this.threadList = [];
    this.postList = [];
  }

  insertElement(array: ObjectID[], element: ObjectID) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].id >= element.id) {
        array.splice(i, 0, element);
      }
    }
  }

  getElementIndex(array: ObjectID[], id: number): number {
    var min = 0;
    var max = array.length - 1;
    var index = -1;
    while (max > min) {
      index = (max - min) / 2;
      if (array[index].id > id) {
        max = index;
      } else if (array[index].id < id) {
        min = index;
      } else {
        return index;
      }
    }
    return index;
  }

  deleteCategory(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      var index = this.getElementIndex(this.categoryList, id);
      if (index >= 0) {
        this.categoryList.splice(index, 1);
        resolve();
      } else reject('Category ID not found');
    });
  }

  deleteThread(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      var index = this.getElementIndex(this.threadList, id);
      if (index >= 0) {
        this.threadList.splice(index, 1);
        resolve();
      } else reject('Thread ID not found');
    });
  }
  deletePost(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      var index = this.getElementIndex(this.postList, id);
      if (index >= 0) {
        this.categoryList.splice(index, 1);
        resolve();
      } else reject('Post ID not found');
    });
  }

  insertCategory(category: Category): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        this.insertElement(this.categoryList, category);
        resolve();
    });
  }
  insertThread(thread: Thread): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.insertElement(this.threadList, thread);
      resolve();
    })
  }
  insertPost(post: Post): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.insertElement(this.postList, post);
      resolve();
    })
  }
  getCategories(): Promise<Category[]> {
    return new Promise<Category[]>((resolve, reject) => {
      resolve(this.categoryList);
    });
  }
  getCategory(id: number): Promise<Category> {
    return new Promise<Category>((resolve, reject) => {
      var index = this.getElementIndex(this.categoryList, id);
      if (index >= 0) {
        resolve(this.categoryList[index]);
      } else reject("Category ID not found");
    });
  }
  getUsersById(ids: number[]): Promise<User[]> {
    return new Promise<User[]>((resolve,reject) => {
      var results: User[] = [];
      ids.forEach((id) => {
        var index = this.getElementIndex(this.userList, id);
        if (index >= 0) {
            results.push(this.userList[index]);
        }
      });
      resolve(results);
    })
  }
  getPosts(ids: number[]): Promise<Post[]> {
    return new Promise<Post[]>((resolve,reject) => {
      var results: Post[] = [];
      ids.forEach((id) => {
        var index = this.getElementIndex(this.postList, id);
        if (index >= 0) {
            results.push(this.postList[index]);
        }
      });
      resolve(results);
    })
  }
  insertUser(user: User): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.insertElement(this.userList, user);
      resolve();
    })
  }
  getNextId(type: string): Promise<number> {
    return new Promise<number>((resolve, reject) =>  {
      resolve(this.nextID++);
    });
  }
  getUserByEmail(email: string): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      for (var i = 0; i < this.userList.length; i++) {
        if (this.userList[i].email == email) {
          resolve(this.userList[i]);
        }
      }
      reject('User does not exist');
    })
  }
  getUserByName(name: string): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      for (var i = 0; i < this.userList.length; i++) {
        if (this.userList[i].username.toLowerCase() == name) {
          resolve(this.userList[i]);
        }
      }
      reject('User does not exist');
    })
  }
  getUserById(id: number): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      var index = this.getElementIndex(this.userList, id);
      if (index >= 0) {
        resolve(this.userList[index]);
      } else {
        reject('User does not exist');
      }
    });
  }
  getThreads(ids: number[]): Promise<Thread[]> {
    return new Promise<Thread[]>((resolve, reject) => {
      var results: Thread[] = [];
      ids.forEach((id) => {
        var index = this.getElementIndex(this.threadList, id);
        if (index >= 0) {
            results.push(this.threadList[index]);
        }
      });
      resolve(results);
    })
  }
}
