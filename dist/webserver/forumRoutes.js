"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonerror_1 = require("../error/jsonerror");
const database_1 = require("../database/database");
let db;
function handleCategory(req, res) {
    db = database_1.getDatabase();
    if (!req.param('category'))
        return res.redirect('/categories');
    let cid = parseInt(req.param('category'));
    db.getCategory(cid).then((category) => {
        db.getThreads(category.threads).then((threads) => {
            res.render('category', { csrfToken: req.csrfToken(), title: category.name, login: req.session.login, threads: threads });
        }).catch(jsonerror_1.renderError(res));
    }).catch(jsonerror_1.renderError(res));
}
exports.handleCategory = handleCategory;
function handleThread(req, res) {
    db = database_1.getDatabase();
    let tid = parseInt(req.param('thread'));
    db.getThreads([tid]).then((threads) => {
        let thread = threads[0];
        db.getPosts(thread.posts).then((posts) => {
            res.render('thread', { csrfToken: req.csrfToken(), title: thread.title, posts: posts });
        });
    });
}
exports.handleThread = handleThread;
function handleCategories(req, res) {
    db = database_1.getDatabase();
    db.getCategories().then((categories) => {
        res.render('categories', { csrfToken: req.csrfToken(), categories: categories });
    });
}
exports.handleCategories = handleCategories;
function handleCreateCategory(req, res) {
    db = database_1.getDatabase();
    let name = req.param('name');
    let description = req.param('description');
    if (name && description) {
        db.getNextId('category').then((id) => {
            let category = {
                name: name,
                description: description,
                threads: [],
                id: id
            };
            db.insertCategory(category).then(() => {
                res.send(jsonerror_1.success());
            }).catch((reason) => {
                res.send(jsonerror_1.error(reason));
            });
        }).catch((reason) => {
            res.send(jsonerror_1.error(reason));
        });
    }
    else
        res.send(jsonerror_1.error('Must specify name and description'));
}
exports.handleCreateCategory = handleCreateCategory;
function handleCreateThread(req, res) {
    db = database_1.getDatabase();
    let title = req.param('title');
    let category = parseInt(req.param('category'));
    let content = req.param('content');
    let author = req.session.login;
    if (!author)
        return res.send(jsonerror_1.error('You must be logged in to do this'));
    if (title && category && content) {
        db.getCategory(category).then((_c) => {
            db.getNextId('thread').then((id) => {
                let thread = {
                    title: title,
                    category: category,
                    id: id,
                    posts: []
                };
                db.insertThread(thread).then(() => {
                    db.getNextId('post').then((pid) => {
                        let post = {
                            thread: id,
                            content: content,
                            id: pid
                        };
                        db.insertPost(post).then(() => {
                            res.send(jsonerror_1.success());
                        }).catch((reason) => {
                            res.send(jsonerror_1.error(reason));
                        });
                    }).catch((reason) => {
                        res.send(jsonerror_1.error(reason));
                    });
                }).catch((reason) => {
                    res.send(jsonerror_1.error(reason));
                });
            }).catch((reason) => {
                res.send(jsonerror_1.error(reason));
            });
        }).then((reason) => {
            res.send(jsonerror_1.error(reason));
        });
    }
    else
        res.send(jsonerror_1.error('Must specify title, category, and content'));
}
exports.handleCreateThread = handleCreateThread;
function handleCreatePost(req, res) {
    db = database_1.getDatabase();
    let thread = parseInt(req.param('thread'));
    let content = req.param('content');
    let author = req.session.login;
    if (!author)
        return res.send(jsonerror_1.error('You must be logged in to do this'));
    if (thread && content) {
        db.getThreads([thread]).then((_threads) => {
            db.getNextId('post').then((id) => {
                let post = {
                    id: id,
                    content: content,
                    author: author,
                    thread: thread
                };
                db.insertPost(post).then(() => {
                    res.send(jsonerror_1.success());
                }).catch((reason) => {
                    res.send(jsonerror_1.error(reason));
                });
            }).catch((reason) => {
                res.send(jsonerror_1.error(reason));
            });
        }).catch((reason) => {
            res.send(jsonerror_1.error(reason));
        });
    }
    else
        res.send(jsonerror_1.error('Must specify thread and content'));
}
exports.handleCreatePost = handleCreatePost;
function handleDeleteCategory(req, res) {
    db = database_1.getDatabase();
    let category = parseInt(req.param('category'));
    if (category) {
        let author = req.session.login;
        if (author) {
            db.getUserById(author).then((user) => {
                if (user.authentication > 1) {
                    db.deleteCategory(category).then(() => {
                        res.send(jsonerror_1.success());
                    }).catch((reason) => {
                        res.send(jsonerror_1.error(reason));
                    });
                }
                else
                    res.send(jsonerror_1.error('You are not allowed to do this'));
            }).catch((reason) => {
                res.send(jsonerror_1.error(reason));
            });
        }
        else
            res.send(jsonerror_1.error('You must be logged in'));
    }
    else
        res.send(jsonerror_1.error('Must specify category'));
}
exports.handleDeleteCategory = handleDeleteCategory;
function handleDeleteThread(req, res) {
    db = database_1.getDatabase();
    let thread = parseInt(req.param('thread'));
    let author = req.session.login;
    if (thread) {
        if (author) {
            db.getUserById(author).then((user) => {
                if (user.authentication > 0) {
                    db.deleteThread(thread).then(() => {
                        res.send(jsonerror_1.success());
                    }).catch((reason) => {
                        res.send(jsonerror_1.error(reason));
                    });
                }
                else
                    res.send(jsonerror_1.error('You are not allowed to do this'));
            }).catch((reason) => {
                res.send(jsonerror_1.error(reason));
            });
        }
        else
            res.send(jsonerror_1.error('You must be logged in'));
    }
    else
        res.send(jsonerror_1.error('Must specify thread'));
}
exports.handleDeleteThread = handleDeleteThread;
function handleDeletePost(req, res) {
    db = database_1.getDatabase();
    let post = parseInt(req.param('post'));
    let author = req.session.login;
    if (post) {
        if (author) {
            db.getUserById(author).then((user) => {
                db.getPosts([post]).then((posts) => {
                    if (user.authentication > 0 || posts[0].author === author) {
                        db.deletePost(post);
                    }
                    else
                        res.send(jsonerror_1.error('You are not allowed to do this'));
                }).catch((reason) => {
                    res.send(jsonerror_1.error(reason));
                });
            }).catch((reason) => {
                res.send(jsonerror_1.error(reason));
            });
        }
        else
            res.send(jsonerror_1.error('You must be logged in'));
    }
    else
        res.send(jsonerror_1.error('Must specify post'));
}
exports.handleDeletePost = handleDeletePost;
//# sourceMappingURL=forumRoutes.js.map