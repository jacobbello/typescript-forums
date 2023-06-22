import { Router } from "express";
import { body, param, validationResult } from "express-validator";
import { db } from "../database/database";
import { sendError } from "../error/error";

const threadRouter = Router();

const threadValidator = () => param('categoryId').exists().isInt();

threadRouter.get('/:threadId', threadValidator(), async (req, res, next) => {
    let r = validationResult(req);
    if (r.isEmpty()) {
        try {
            let threads = await db.getThreads([req.params.threadId]);
            if (threads.length == 0) next(); // Pass to 404 handler
            res.render('thread', { thread: threads[0] });
        } catch (e) {
            next(e);
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
            

        } catch(e) {
            sendError(res, 'Error creating thread');
            console.error(e);
        }
        db.getNextId('thread').then(id => {
            db.insertThread
            return id;
        }).then(id => {

        })

    } else sendError(res, "You must include a title and body");
});

threadRouter.post('/delete/:threadId', threadValidator(), (req, res) => {

});

export default threadRouter;