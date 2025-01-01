import { Router } from "express";
import { body, param, query, validationResult } from "express-validator";
import { CategoryNotFoundError, ThreadNotFoundError, UserNotFoundError, db } from "../database/database";
import { sendError, sendSuccess } from "../error/error";

const threadRouter = Router();

const threadValidator = () => param('threadId').exists().isInt();
/** Load thread pages GET /thread/[id] */
threadRouter.get('/view/:threadId', threadValidator(), async (req, res, next) => {
    let r = validationResult(req);
    if (r.isEmpty()) {
        try {
            let thread = await db.getThread(parseInt(req.params.threadId));
            let posts = await db.getPosts(thread.id);
            let posts_data = [];
            for (const post of posts) {
                let name = "User Not Found";
                try {
                    name = (await db.getUserById(post.author)).username;
                } catch(e) {
                    if (e instanceof UserNotFoundError) {
                        //TODO handle error properly
                        console.log("User not found: " + post.author);
                    }
                }
                posts_data.push({
                    content: post.content,
                    author: name,
                    id: post.id,
                });
            }

            res.render('thread', { thread: thread, posts: posts_data});
        } catch (e) {
            if (e instanceof ThreadNotFoundError) next();
            else next(e);
        }
    } else next(r.array());
});

threadRouter.get('/new', query('categoryId').exists().isInt(), async (req, res, next) => {
    let r = validationResult(req);
    if (r.isEmpty() || true) {
        try {
            let category = await db.getCategory(parseInt(req.query.categoryId));
            res.render('newthread', { category: category });
        } catch (e) {
            console.log(e);
            if (e instanceof CategoryNotFoundError) next();
            else next(e);
        }
    } else next();
})

/**
 * Handle thread creation JSON request
 * Body params category, title, content
 */
threadRouter.post('/create', body('title').exists().isAscii(), body('content').exists().isAscii(), body('category').exists().isInt(), async (req, res, next) => {
    let r = validationResult(req);
    if (r.isEmpty()) {
        try {
            let categoryId = parseInt(req.body.category);
            let category = await db.getCategory(categoryId);
            let thread = await db.insertThread({
                author: req.session.login,
                category: categoryId,
                title: req.body.title,
                id: -1
            });
            try {
                await db.insertPost({
                    author: req.session.login,
                    thread: thread.id,
                    id: -1,
                    content: req.body.content
                });
            } catch (e) {
                await db.deleteThread(thread.id);
            }
            sendSuccess(res);
        } catch (e) {
            sendError(res, 'Error creating thread');
            console.error(e);
        }
    } else sendError(res, "You must include a title and body");
});

/**
 * Handle thread deletion
 * POST /thread/delete/[id]
 */
threadRouter.post('/delete/:threadId', threadValidator(), async (req, res) => {
    let r = validationResult(req);
    if (r.isEmpty()) {
        try {
            let thread = await db.getThread(req.params.threadId);
            await db.deleteThread(thread.id);
            sendSuccess(res);
        } catch (e) {
            sendError(res, 'Error deleting thread');
            console.error(e);
        }
    }
});

export default threadRouter;