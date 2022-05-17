import UserModel, { User } from "../model/user.model";

export function createUser(input: Partial<User>){
	return UserModel.create(input);
}

export function findUserById(id: String){
	return UserModel.findById(id);
}

export function findUserByEmail(email: String){
	return UserModel.findOne({ email });
}