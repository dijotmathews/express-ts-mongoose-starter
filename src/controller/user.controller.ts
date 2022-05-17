import { CreatUserInput, ForgotPasswordInput, VerifyUserInput, ResetPasswordInput } from '../schema/user.schema';
import { createUser, findUserById, findUserByEmail } from '../service/user.service';

import {Request, Response} from 'express';
import sendEmail from '../utils/mailer';
import { nanoid } from 'nanoid';


export async function createUserHandler(req: Request<{}, {}, CreatUserInput>, res: Response){
	const body = req.body;
	try {
		const user = await createUser(body);
		await sendEmail({
			from: 'test@e.com',
			to: user.email,
			subject: "Please verfy your account",
			text: `verification code ${user.verificationCode}, Id: ${user._id} `
		});
		return res.send("User successfully created");
	} catch (e: any) {
		if(e.code === 11000){
			return res.status(400).send("Account already exist");
		}
		return res.status(500).send(e);
	}

	
}

export async function verfiyUserHandler(req: Request<VerifyUserInput>, res: Response){
	const id = req.params.id;
	const verificationCode = req.params.verificationCode;

	const user = await findUserById(id);
	if(!user){
		return res.send('Could not verify user');
	}

	if(user.verified){
		return res.send('User is already verified.');
	}

	if(user.verificationCode === verificationCode) {
		user.verified = true;

		await user.save();

		return res.send("User successfuly verified");
	}

	return res.send('Could not verify user');

}

export async function forgotPasswordHandler(req: Request<{}, {}, ForgotPasswordInput>, res: Response){
	const message = "If user is present in the system you should receive a reset mail in the email provided.";
	
	const { email } = req.body;
	const user = await findUserByEmail(email);
	if(!user){
		return res.send(message)
	}

	if(!user.verified) {
		return res.send("User if not verified");
	}

	const passwordResetCode = nanoid();
	user.passwordResetCode = passwordResetCode;

	user.save();
	await sendEmail({
		to: user.email,
		from: "test@t.io",
		subject: 'reset passcode',
		text: `Password reset code ${passwordResetCode} . Id ${user._id}`
	})

	return res.send(message);

}

export async function resetPasswordHnadler(req: Request<ResetPasswordInput['params'],{}, ResetPasswordInput['body']>, res: Response){
	const { id, passwordResetCode } = req.params;
	const { password } = req.body;

	const user = findUserById(id);

	if(!user || !user.passwordResetCode || user.passwordResetCode !== passwordResetCode) {
		return res.status(400).send("Could not reset user password");
	}

	user.passwordResetCode = null;
	user.password = password;

	await user.save();

	return res.set("Successfully update password");



}