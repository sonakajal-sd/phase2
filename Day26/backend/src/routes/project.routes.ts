import {Router} from "express";
import prisma from "../lib/prisma";

const router= Router();

router.get("/",async(req, res)=>{
    try{
        const projects= await prisma.project.findMany();
        res.json(projects);
    }
    catch(error){
        res.status(500).json({
            message:"Failed to fetch projects"
        });
    }
})
export default router;