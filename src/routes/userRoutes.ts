import {Request, Response} from 'express';

export function handleProfile(req: Request, res: Response) {
  res.render('profile', {});
}
