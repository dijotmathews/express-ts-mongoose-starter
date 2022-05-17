import express from 'express';
import { createUserHandler, forgotPasswordHandler, resetPasswordHnadler, verfiyUserHandler } from '../controller/user.controller';
import validateResource from '../middleware/validateResource';
import { createUserSchema, forgotPasswordSchema, resetPasswordSchema, verifyUserSchema } from '../schema/user.schema';

const router = express.Router();

router.post('/api/users',validateResource(createUserSchema), createUserHandler);

router.post('/api/users/verify/:id/:verificationCode', validateResource(verifyUserSchema), verfiyUserHandler);

router.post('/api/users/forgotpassword', validateResource(forgotPasswordSchema), forgotPasswordHandler);

router.post('/api/users/resetPassword/:id/:passwordResetCode', validateResource(resetPasswordSchema), resetPasswordHnadler);

export default router;