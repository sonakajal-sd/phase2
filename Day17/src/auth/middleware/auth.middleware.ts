import type { Request ,Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma.js";

export async function authMiddleWare(
    req:Request,
    res:Response,
    next:NextFunction
){
  const authHeader= req.headers.authorization;

  if(!authHeader){
    return res.status(401).json({
        message:"Authentication required",
    });
  }
  const [scheme, token]= authHeader.split(" "); // "blahhhh lalalal"
  if(scheme !=="Bearer"|| !token){
    return res.status(401).json({
        message:"invalid authourization header",
    });
  }

  const secret= process.env.JWT_SECRET;

  if(!secret){
    throw new Error("JWT_SECRRET is not configured");
  }
  try{
   const decoded= jwt.verify(token,secret);

   if(typeof decoded ==="object" && "userId" in decoded){
    const userId = decoded.userId;

const user = await prisma.user.findUnique({
  where: {
    id: userId,
  },
});

if (!user) {
  return res.status(401).json({
    message: "Invalid token",
  });
}

res.locals.userId = user.id;
res.locals.role = user.role;

   }
   else{
    return res.status(401).json({
        message:"invalid token",
    });
   }
  }
  catch{
    return res.status(401).json({
        message:"Invalid or expired token",
    })
  }


    next();
}