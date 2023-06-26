import { Router } from 'express';
import { UserNotFoundError, db } from '../database/database';
import { param, validationResult } from 'express-validator';
import { sendError, sendSuccess } from '../error/error';

const profileRouter = Router();
const profileValidator = () => param('profileId').isInt().exists();

profileRouter.get('/', async (req, res, next) => {
    if (req.session.login) {
        try {
            let user = await db.getUserById(req.session.login);
            res.render('profile', { user: user });
        } catch (e) {
            if (!(e instanceof UserNotFoundError)) console.error(e);
            res.redirect('/');
        }
    } else res.redirect('/');
});

profileRouter.get('/:profileId', profileValidator(),
    async (req, res, next) => {
        let r = validationResult(req);
        if (r.isEmpty()) {
            try {
                let user = await db.getUserById(parseInt(req.params.profileId));
                res.render('profile', {user: user});
            } catch (e) {
                if (!(e instanceof UserNotFoundError)) console.error(e);
                next();
            }
        } else next();
    }
);

profileRouter.get('/user/:profileId', profileValidator(), async (req, res, next) => {
    let r = validationResult(req);
    if (r.isEmpty()) {
        try {
            let user = await db.getUserById(parseInt(req.params.profileId));
            sendSuccess(res, user);
        } catch(e) {
            if (!(e instanceof UserNotFoundError)) console.error(e);
            sendError(res, e instanceof UserNotFoundError ? 'User not found' : 'Unknown error');
        }
    } else sendError(res, 'Invalid user id');
});

export default profileRouter;