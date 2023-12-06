import { Router } from "express";
import { body, param, validationResult } from "express-validator";
import { ThreadNotFoundError, db } from "../database/database";
import { sendError, sendSuccess } from "../error/error";

const threadRouter = Router();

const threadValidator = () => param('categoryId').exists().isInt();
/** Load thread pages GET /thread/[id] */
threadRouter.get('/:threadId', threadValidator(), async (req, res, next) => {
    let r = validationResult(req);
    if (r.isEmpty()) {
        try {
            let thread = await db.getThread(req.params.threadId);
            res.render('thread', { thread: thread});
        } catch (e) {
            if (e instanceof ThreadNotFoundError) next();
            else next(e);
        }
    } else next();
});

/**
 * Handle thread creation JSON request
 * Body params category, title, content
 */
threadRouter.post('/create', body('title').exists().isAscii(), body('content').exists().isAscii(), body('category').exists().isInt(), async (req, res, next) => {
    let r = validationResult(req);
    if (r.isEmpty()) {
        try {
            let category = await db.getCategory(req.body.category);
            await db.insertThread({
                author: req.session.login,
                category: req.body.category,
                title: req.body.title,
                id: -1
            });
            sendSuccess(res);
        } catch(e) {
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
        } catch(e) {
            sendError(res, 'Error deleting thread');
            console.error(e);
        }
    }
});

export default threadRouter;