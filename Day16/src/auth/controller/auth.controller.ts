import { registerUser,loginUser } from "../service/auth.service.js";

import type {Request, Response}  from "express";
import { prisma } from "../../lib/prisma.js";
import { Prisma } from "../../../generated/prisma/client.js";
import { registerSchema, loginSchema } from "../validation/auth.schema.js";


export async function registerController(req:Request, res:Response) {
    const result= registerSchema.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({
            message:"Invalid request data",
        });
    }
    try{
         const {email, password}= result.data;
    const user=await registerUser(email, password);

    res.status(201).json(user);
    }
    catch(error){
        if(
            error instanceof Prisma.PrismaClientKnownRequestError && error.code ==="P2002"
        ){
            return res.status(400).json({
                message:"Email already registered",
            });
        }
        return res.status(500).json({
            message:"Internal Server error",
        })
    }
   
}



export async function loginController(req:Request, res:Response){
    const result = loginSchema.safeParse(req.body);

    if(!result.success){
        return res.status(400).json({
            message:"Invalid email or password",
        });
    }
    try{
         const {email, password}= result.data;

    const user= await loginUser(email,password);

    res.status(200).json(user);
    }
    catch{
        return res.status(401).json({
            message:"Invalid email or password",
        });
    }
   
}


export async function meController(
    req:Request,
    res:Response
){
    const userId= res.locals.userId;
const user= await prisma.user.findUnique({
    where:{
        id:userId,
    },
});
if(!user){
    return res.status(404).json({
        message:"User not found",
    });
}
return res.status(200).json({
    id:user.id,
    email:user.email,
});
}


