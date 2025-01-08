
import express, { response } from "express"
import { prisma } from "../prisma.js";
import bcrypt from "bcryptjs";
import { authorizeRole, generateAccessToken, generateRefreshToken, verifyAuthorization } from "../jwt/util.mjs";
import jwt from "jsonwebtoken"

const userRoute = express.Router();

userRoute.get("/allUsers", verifyAuthorization, authorizeRole("USER"), (req, res) => {
   res.status(200).json({ message: "Welcome, user!" });
});

userRoute.post("/createUser", async (req, res) => {
   const { email, password, role, name } = req.body;

   // Validate required fields
   if (!email || !password || !name) {
      return res.status(400).json({
         message: "Both email and password are required."
      });
   }

   // Define regex for validation
   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

   const errors = [];

   // Validate email format
   if (!emailRegex.test(email)) {
      errors.push("Invalid email format.");
   }

   // Validate password format
   if (!passwordRegex.test(password)) {
      errors.push(
         "Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 8 characters long."
      );
   }

   // Check if there are validation errors
   if (errors.length > 0) {
      return res.status(400).json({
         message: "Validation errors occurred.",
         errors,
      });
   }

   try {
      // Check if email already exists in the database
      const existingUser = await prisma.user.findUnique({
         where: { email },
      });

      if (existingUser) {
         return res.status(409).json({
            message: "A user with this email already exists.",
         });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt)



      const user = await prisma.user.create({
         data: {
            email,
            password: hashPassword, // Consider hashing the password before saving it
            name,
            role: role || "USER", // Default role if none provided
         },
      });

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      const responseUser = { name: user.name, email: user.email, role: user.role }

      // Respond with the created user
      res.status(201).json({
         message: "User created successfully.",
         user: responseUser,
         accessToken,
         refreshToken
      });

   } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({
         message: "An internal server error occurred.",
         error: error.message,
      });
   }
});

userRoute.post("/login", async (req, res) => {
   // const beare = req.headers.authorization.split(" ")[1]
   const { email, password } = req.body;

   if (!email || !password) {
      return res.status(400).json({
         message: "Both email and password are required."
      })
   }

   try {
      const user = await prisma.user.findUnique({ where: { email } })

      if (!user) {
         return res.status(401).json({ message: "Invalid email or password." });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
         return res.status(401).json({ message: "Invalid email or password." });
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
   
      const responseUser = { name: user.name, email: user.email, role: user.role }
   
      // Respond with the created user
      res.status(201).json({
         message: "User created successfully.",
         user: responseUser,
         accessToken,
         refreshToken
      });

   } catch (error){
      console.log(error);
   }

});

export { userRoute }