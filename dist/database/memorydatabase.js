"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MemoryDatabase {
    constructor() {
        this.nextID = 1;
        this.userList = [];
        this.categoryList = [];
        this.threadList = [];
        this.postList = [];
    }
    insertElement(array, element) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].id >= element.id) {
                array.splice(i, 0, element);
            }
        }
    }
    getElementIndex(array, id) {
        var min = 0;
        var max = array.length - 1;
        var index = -1;
        while (max > min) {
            index = (max - min) / 2;
            if (array[index].id > id) {
                max = index;
            }
            else if (array[index].id < id) {
                min = index;
            }
            else {
                return index;
            }
        }
        return index;
    }
    deleteCategory(id) {
        return new Promise((resolve, reject) => {
            var index = this.getElementIndex(this.categoryList, id);
            if (index >= 0) {
                this.categoryList.splice(index, 1);
                resolve();
            }
            else
                reject('Category ID not found');
        });
    }
    deleteThread(id) {
        return new Promise((resolve, reject) => {
            var index = this.getElementIndex(this.threadList, id);
            if (index >= 0) {
                this.threadList.splice(index, 1);
                resolve();
            }
            else
                reject('Thread ID not found');
        });
    }
    deletePost(id) {
        return new Promise((resolve, reject) => {
            var index = this.getElementIndex(this.postList, id);
            if (index >= 0) {
                this.categoryList.splice(index, 1);
                resolve();
            }
            else
                reject('Post ID not found');
        });
    }
    insertCategory(category) {
        return new Promise((resolve, reject) => {
            this.insertElement(this.categoryList, category);
            resolve();
        });
    }
    insertThread(thread) {
        return new Promise((resolve, reject) => {
            this.insertElement(this.threadList, thread);
            resolve();
        });
    }
    insertPost(post) {
        return new Promise((resolve, reject) => {
            this.insertElement(this.postList, post);
            resolve();
        });
    }
    getCategories() {
        return new Promise((resolve, reject) => {
            resolve(this.categoryList);
        });
    }
    getCategory(id) {
        return new Promise((resolve, reject) => {
            var index = this.getElementIndex(this.categoryList, id);
            if (index >= 0) {
                resolve(this.categoryList[index]);
            }
            else
                reject("Category ID not found");
        });
    }
    getUsersById(ids) {
        return new Promise((resolve, reject) => {
            var results = [];
            ids.forEach((id) => {
                var index = this.getElementIndex(this.userList, id);
                if (index >= 0) {
                    results.push(this.userList[index]);
                }
            });
            resolve(results);
        });
    }
    getPosts(ids) {
        return new Promise((resolve, reject) => {
            var results = [];
            ids.forEach((id) => {
                var index = this.getElementIndex(this.postList, id);
                if (index >= 0) {
                    results.push(this.postList[index]);
                }
            });
            resolve(results);
        });
    }
    insertUser(user) {
        return new Promise((resolve, reject) => {
            this.insertElement(this.userList, user);
            resolve();
        });
    }
    getNextId(type) {
        return new Promise((resolve, reject) => {
            resolve(this.nextID++);
        });
    }
    getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            for (var i = 0; i < this.userList.length; i++) {
                if (this.userList[i].email == email) {
                    resolve(this.userList[i]);
                }
            }
            reject('User does not exist');
        });
    }
    getUserByName(name) {
        return new Promise((resolve, reject) => {
            for (var i = 0; i < this.userList.length; i++) {
                if (this.userList[i].username.toLowerCase() == name) {
                    resolve(this.userList[i]);
                }
            }
            reject('User does not exist');
        });
    }
    getUserById(id) {
        return new Promise((resolve, reject) => {
            var index = this.getElementIndex(this.userList, id);
            if (index >= 0) {
                resolve(this.userList[index]);
            }
            else {
                reject('User does not exist');
            }
        });
    }
    getThreads(ids) {
        return new Promise((resolve, reject) => {
            var results = [];
            ids.forEach((id) => {
                var index = this.getElementIndex(this.threadList, id);
                if (index >= 0) {
                    results.push(this.threadList[index]);
                }
            });
            resolve(results);
        });
    }
}
exports.default = MemoryDatabase;
//# sourceMappingURL=memorydatabase.js.map