import type { Request, Response, NextFunction} from "express";

export function requireRole(role:string){
    return (req:Request, res:Response, next:NextFunction)=>{

        const userRole= res.locals.role;
        
        if(userRole !== role){
            return res.status(403).json({
                message:"Forbidden"
            });
        }
        next()
    };
}