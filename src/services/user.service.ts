import { response } from "express";
import User, { IUser } from "../models/user.model";

export async function getUser(userId: string): Promise<IUser|null> {
    const user = await User.findById(userId);
    return user;
}

export async function setAdmin(userId: string): Promise<IUser|null> {
    const user = await User.findByIdAndUpdate(userId, {role: "admin"}, {new: true});
    return user;
}

export async function setUser(userId: string): Promise<IUser|null> {
    const user = await User.findByIdAndUpdate(userId, {role: "user"}, {new: true});
    return user;
}

export async function getAllUsers(): Promise<IUser[]> {
    const users = await User.find();
    //Remove passwords from the response
    const responseUsers = users.map(user => {
        const {password, ...userWithoutPassword} = user.toObject();
        return userWithoutPassword as IUser;
    });
    
    return responseUsers;
}
