import { Router } from "express";
import { Category, CategoryNotFoundError, db } from "../database/database";
import { body, param, validationResult } from "express-validator";
import { sendError, sendSuccess } from "../error/error";

const categoryRouter = Router();
const categoryValidator = () => param('categoryId').exists().isInt();

categoryRouter.get('/', async (req, res, next) => {
    try {
        let categories = await db.getCategories();
        res.render('categories', { categories: categories });
    } catch (e) {
        next(e);
    }
});

//TODO pagination
categoryRouter.get('/:categoryId', categoryValidator(), async (req, res, next) => {
    let r = validationResult(req);
    if (r.isEmpty()) {
        try {
            let category = await db.getCategory(req.params.categoryId);
            let threads = await db.getThreads(category.threads);
            res.render('category', { category: category, threads: threads });
        } catch (e) {
            if (e instanceof CategoryNotFoundError) next();
            else next(e);
        }
    } else next();
});

categoryRouter.post('/create', body('name').exists().isAscii(), body('description').exists(), async (req, res) => {
    let r = validationResult(req);
    if (r.isEmpty()) {
        try {
            let id = await db.getNextId('category');
            await db.insertCategory({ id: id, name: req.body.name, description: req.body.description, threads: [] });
            sendSuccess(res)
        } catch (e) {
            console.error(e);
            sendError(res, "Error creating category");
        }
    } else sendError(res, 'Invalid name or description');
});

categoryRouter.post('/delete/:categoryId', categoryValidator(), async (req, res) => {
    let r = validationResult(req);
    if (r.isEmpty()) {
        try {
            await db.deleteCategory(req.params.categoryId)
            sendSuccess(res);
        } catch (e) {
            sendError(res, "Error deleting category");
            console.error(e);
        };
    } else sendError(res, "Category not found");
});

export default categoryRouter;