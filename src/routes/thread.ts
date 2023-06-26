import { Router } from "express";
import { body, param, validationResult } from "express-validator";
import { ThreadNotFoundError, db } from "../database/database";
import { sendError, sendSuccess } from "../error/error";

const threadRouter = Router();

const threadValidator = () => param('categoryId').exists().isInt();

threadRouter.get('/:threadId', threadValidator(), async (req, res, next) => {
    let r = validationResult(req);
    if (r.isEmpty()) {
        try {
            let thread = await db.getThread(req.params.threadId);
            res.render('thread', { thread: thread });
        } catch (e) {
            if (e instanceof ThreadNotFoundError) next();
            else next(e);
        }
    } else next();
});

threadRouter.post('/create', body('title').exists().isAscii(), body('content').exists().isAscii(), body('category').exists().isInt(), async (req, res, next) => {
    let r = validationResult(req);
    if (r.isEmpty()) {
        try {
            let category = await db.getCategory(req.body.category);
            let threadId = await db.getNextId('thread');
            let postId = await db.getNextId('post');
            await db.insertThread({
                author: req.session.login,
                category: req.body.category,
                title: req.body.title,
                id: threadId,
            });
            sendSuccess(res);
        } catch(e) {
            sendError(res, 'Error creating thread');
            console.error(e);
        }
    } else sendError(res, "You must include a title and body");
});

threadRouter.post('/delete/:threadId', threadValidator(), async (req, res) => {
    let r = validationResult(req);
    if (r.isEmpty()) {
        try {
            let thread = await db.getThread(req.params.threadId);
            await db.deleteThread(thread.id);
            sendSuccess(res);
        } catch(e) {
            sendError(res, 'Error deleting thread');
            console.error(e);
        }
    }
});

export default threadRouter;