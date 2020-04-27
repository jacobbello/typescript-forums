import {Request, Response} from 'express';
import {success, error, renderError} from '../error/jsonerror';
import {getDatabase, User, Post, Thread, Category, Database} from '../database/database';

let db: Database;

export function handleCategory(req: Request, res: Response) {
  db = getDatabase();
  if (!req.param('category')) return res.redirect('/categories');
  let cid = parseInt(req.param('category'));
  db.getCategory(cid).then((category: Category) => {
    db.getThreads(category.threads).then((threads: Thread[]) => {
      res.render('category', {csrfToken: req.csrfToken(), title: category.name, login: req.session.login, threads: threads});
    }).catch(renderError(res));
  }).catch(renderError(res));
}

export function handleThread(req: Request, res: Response) {
  db = getDatabase();
  let tid = parseInt(req.param('thread'));
  db.getThreads([tid]).then((threads: Thread[]) => {
    let thread = threads[0];
    db.getPosts(thread.posts).then((posts: Post[]) => {
      res.render('thread', {csrfToken: req.csrfToken(), title: thread.title, posts: posts});
    });
  });
}

export function handleCategories(req: Request, res: Response) {
  db = getDatabase();
  db.getCategories().then((categories: Category[]) => {
    res.render('categories', {csrfToken: req.csrfToken(), categories: categories});
  });
}

export function handleCreateCategory(req: Request, res: Response) {
  db = getDatabase();
  let name = req.param('name');
  let description = req.param('description');
  if (name && description) {
    db.getNextId('category').then((id: number) => {
      let category = {
        name: name,
        description: description,
        threads: [],
        id: id
      } as Category;
      db.insertCategory(category).then(() => {
        res.send(success());
      }).catch((reason: any) => {
        res.send(error(reason));
      })
    }).catch((reason: any) => {
      res.send(error(reason));
    })

  } else res.send(error('Must specify name and description'));
}

export function handleCreateThread(req: Request, res: Response) {
  db = getDatabase();
  let title = req.param('title');
  let category = parseInt(req.param('category'));
  let content = req.param('content');
  let author = req.session.login;
  if (!author) return res.send(error('You must be logged in to do this'));
  if (title && category && content) {
    db.getCategory(category).then((_c: Category) => {
      db.getNextId('thread').then((id: number) => {
        let thread = {
          title: title,
          category: category,
          id: id,
          posts: []
        } as Thread;
        db.insertThread(thread).then(() => {
          db.getNextId('post').then((pid: number) => {
            let post = {
              thread: id,
              content: content,
              id: pid
            } as Post;
            db.insertPost(post).then(() => {
              res.send(success());
            }).catch((reason: any) => {
              res.send(error(reason));
            });
          }).catch((reason: any) => {
            res.send(error(reason));
          })
        }).catch((reason: any) => {
          res.send(error(reason));
        });
      }).catch((reason: any) => {
        res.send(error(reason));
      });
    }).then((reason: any) => {
      res.send(error(reason));
    })
  } else res.send(error('Must specify title, category, and content'));
}

export function handleCreatePost(req: Request, res: Response) {
  db = getDatabase();
  let thread = parseInt(req.param('thread'));
  let content = req.param('content');
  let author = req.session.login;
  if (!author) return res.send(error('You must be logged in to do this'));
  if (thread && content) {
    db.getThreads([thread]).then((_threads: Thread[]) => {
      db.getNextId('post').then((id: number) => {
        let post = {
          id: id,
          content: content,
          author: author,
          thread: thread
        } as Post;
        db.insertPost(post).then(() => {
          res.send(success());
        }).catch((reason: any) => {
          res.send(error(reason));
        });
      }).catch((reason: any) => {
        res.send(error(reason));
      });
    }).catch((reason: any) => {
      res.send(error(reason));
    });
  } else res.send(error('Must specify thread and content'));
}

export function handleDeleteCategory(req: Request, res: Response) {
  db = getDatabase();
  let category = parseInt(req.param('category'));
  if (category) {
    let author = req.session.login;
    if (author) {
      db.getUserById(author).then((user: User) => {
        if (user.authentication > 1) {
          db.deleteCategory(category).then(() => {
            res.send(success());
          }).catch((reason: any) => {
            res.send(error(reason));
          })
        } else res.send(error('You are not allowed to do this'));
      }).catch((reason: any) => {
        res.send(error(reason));
      });
    } else res.send(error('You must be logged in'));
  } else res.send(error('Must specify category'));
}

export function handleDeleteThread(req: Request, res: Response) {
  db = getDatabase();
  let thread = parseInt(req.param('thread'));
  let author = req.session.login;
  if (thread) {
    if (author) {
      db.getUserById(author).then((user: User) => {
        if (user.authentication > 0) {
          db.deleteThread(thread).then(() => {
            res.send(success());
          }).catch((reason: any) => {
            res.send(error(reason));
          });
        } else res.send(error('You are not allowed to do this'))
      }).catch((reason: any) => {
        res.send(error(reason));
      });
    } else res.send(error('You must be logged in'));
  } else res.send(error('Must specify thread'));
}

export function handleDeletePost(req: Request, res: Response) {
  db = getDatabase();
  let post = parseInt(req.param('post'));
  let author = req.session.login;
  if (post) {
    if (author) {
      db.getUserById(author).then((user: User) => {
        db.getPosts([post]).then((posts: Post[]) => {
          if (user.authentication > 0 || posts[0].author === author) {
            db.deletePost(post);
          } else res.send(error('You are not allowed to do this'));
        }).catch((reason: any) => {
          res.send(error(reason));
        });
      }).catch((reason: any) => {
        res.send(error(reason));
      });
    } else res.send(error('You must be logged in'));
  } else res.send(error('Must specify post'));
}
