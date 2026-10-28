import {Router} from "express";
import prisma from "../lib/prisma";

const router= Router();

// GET /api/issues            -> all issues
// GET /api/issues?projectId=1 -> issues for one project
router.get("/", async(req, res)=>{
    try{
        const {projectId}= req.query;
        let where= {};

        if(projectId !== undefined){
            const id= Number(projectId);
            if(!Number.isInteger(id) || id<=0){
                return res.status(400).json({message:"invalid project ID"});
            }
            where= {projectId:id};
        }

        const issues= await prisma.issue.findMany({where, orderBy:{id:"asc"}});
        res.json(issues);
    }
    catch(error){
        res.status(500).json({
            message:"Failed to fetch issues"
        });
    }
});

router.get("/:id", async(req, res)=>{
    try{
        const id= Number(req.params.id);
        if(!Number.isInteger(id) || id<=0){
            return res.status(400).json({ message:"invalid issue ID"});
        }

        const issue= await prisma.issue.findUnique({
            where:{id},
        });

        if(!issue){
            return res.status(404).json({message:"issue not found"});
        }

        res.json(issue);
    }catch{
        res.status(500).json({message:"Failed to fetch issue"});
    }
});

export default router;
