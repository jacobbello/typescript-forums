import {Response} from 'express';

/**
 * Send JSON error response
 * @param res Express response object
 * @param err Error to include in message
 */
export function sendError(res: Response, err: any) {
    res.json({success: false, error: err});
}

/**
 * Send JSON success message
 * @param res Express response object
 * @param result Result to include in message
 */
export function sendSuccess(res: Response, result?: any) {
    res.json({success: true, result: result})
}