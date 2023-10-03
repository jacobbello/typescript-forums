import { Router } from "express";
import { body, param, validationResult } from "express-validator";
import { PostNotFoundError, ThreadNotFoundError, db } from "../database/database";
import { sendError, sendSuccess } from "../error/error";

const postRouter = Router();
const postValidator = () => param('postId').exists().isInt();

/*
    Send JSON post - to be used for async post loading
*/
postRouter.get('/:postId', postValidator(), async (req, res) => {
    let r = validationResult(req);
    if (r.isEmpty()) {
        try {
            let post = await db.getPost(parseInt(req.params.postId));
            sendSuccess(res, post);
        } catch (e) {
            if (!(e instanceof PostNotFoundError)) {
                console.error(e);
                sendError(res, 'Error loading post');
            } else sendError(res, 'Post not found');
        }
    } else sendError(res, 'Invalid post ID');
});

postRouter.post('/create', body('thread').exists().isInt(),
    body('content').exists(),
    async (req, res) => {
        let r = validationResult(req);
        if (r.isEmpty()) {
            try {
                let tid = parseInt(req.body.thread);
                await db.getThread(tid);
                await db.insertPost({
                    thread: tid,
                    content: req.body.content,
                    author: req.session.login,
                    id: -1
                });
                sendSuccess(res);
            } catch(e) {
                if (e instanceof ThreadNotFoundError) sendError(res, 'Thread not found');
                else {
                    console.error(e);
                    sendError(res, 'Error saving post');
                }
            }
        } else sendError(res, 'Invalid thread ID or content');
    });

postRouter.post('/delete/:postId', postValidator, async (req, res) => {
    let r = validationResult(req);
    if (r.isEmpty()) {
        try {
            let id = parseInt(req.params.postId);
            let post = await db.getPost(id);
        } catch(e) {
            if (e instanceof PostNotFoundError) sendError(res, 'Post not found');
            else {
                sendError(res, 'Error deleting post');
                console.error(e);
            }
        }
    } else sendError(res, 'Invalid post ID');
});

export default postRouter;