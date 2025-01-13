import express from "express"
import multer from "multer"

const eventRoutes=express.Router();
const storage=multer.memoryStorage();
const upload=multer({storage});


eventRoutes.post((req,res,next)=>{
   const {} = req.body
});

export default eventRoutes;