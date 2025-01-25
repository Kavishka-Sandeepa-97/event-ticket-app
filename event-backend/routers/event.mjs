import express from "express"
import multer from "multer"

const eventRoutes=express.Router();
const storage=multer.memoryStorage();
//const upload=multer({storage});





   const upload = multer({
      dest: 'uploads/', // Files will be stored in the "uploads" folder
    });
    
    eventRoutes.post('/createEvent', upload.single('image'), (req, res) => {
      // Access the uploaded file via req.file
      console.log(req.body);
    
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
    
      res.status(201).send({
        message: 'File uploaded successfully',
        file: req.body, // Returns file metadata
      });
    });


export default eventRoutes;