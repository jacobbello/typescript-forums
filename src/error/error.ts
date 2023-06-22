import {Response} from 'express';

export function sendError(res: Response, err: any) {
    res.json({success: false, error: err});
}

export function sendSuccess(res: Response, result?: any) {
    res.json({success: true, result: result})
}