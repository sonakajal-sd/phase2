import { Prisma, PrismaClient } from "../../../generated/prisma/client.js";
import { hashPassword,comparePassword } from "../utils/password.js";
import {prisma} from "../../lib/prisma.js";
import { generateAccessToken } from "../utils/token.js";


export async function registerUser(
    email:string,
    password:string
){
    const passwordHash= await hashPassword(password);
    
    const user= await prisma.user.create({
        data:{
            email,
            passwordHash,
        },
    });
    return {
        id:user.id,
        email:user.email,
    }
}


export async function loginUser(
    email:string,
    password:string,
){

   
    const user=await prisma.user.findUnique({
        where:{
            email,
        },
    });
    if(!user){
        throw new Error("Invalid email or password");
    }

    const isPasswordValid= await comparePassword(password, user.passwordHash);
    if(!isPasswordValid){
        throw new Error("Invalid email or password");
    }
     const accessToken= generateAccessToken(user.id);


    return{
        id:user.id,
        email:user.email,
        accessToken
    }
}