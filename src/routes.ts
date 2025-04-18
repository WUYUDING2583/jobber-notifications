import express from 'express';
import { Router, Request, Response } from 'express-serve-static-core';
import { StatusCodes } from 'http-status-codes';

const router: Router = express.Router();

export function healthRoutes(): Router {
  router.get('/notification-health', (_req: Request, res: Response) => {
    res.status(StatusCodes.OK).send('Notification Service is healthy and OK.');
  });
  return router;
}
