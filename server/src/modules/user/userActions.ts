import { RequestHandler } from "express";
import User from "../../../database/models/user.model";
import jwt from "jsonwebtoken";

const createUser: RequestHandler = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            res.status(422).json({ message: "Échec lors de l'inscription" });
          }
        
        const user = new User({ firstName, lastName, email, password });
        await user.save();

        const payload = {
            userId: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdmin: user.isAdmin,
          }

          if (!process.env.JWT_SECRET) {
            throw new Error("Vous n'avez pas configuré votre JWT SECRET dans le .env");
          }

          const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "1y" });
          
          res.cookie("CP4auth", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 31536000000,
          }).json({ message: "Inscription réussie", id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, isAdmin: user.isAdmin });
  
    } catch (error) {
        next(error);
    }
}

const loginUser: RequestHandler = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            res.status(401).json({ error: "Identifiants invalides" });
        } else {

            const payload = {
             userId: user._id,
             email: user.email,
             firstName: user.firstName,
             lastName: user.lastName,
             isAdmin: user.isAdmin,
            }
            
            if (!process.env.JWT_SECRET) {
             throw new Error(
               "Vous n'avez pas configuré votre JWT SECRET dans le .env",
             );
           }
 
           const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "1y" });
           res.cookie("CP4auth", token, {
             httpOnly: true,
             sameSite: "strict",
             secure: process.env.NODE_ENV === "production",
             maxAge: 31536000000,
           }).json({ 
             message: "Connexion réussie", 
             id: user._id, 
             email: user.email, 
             firstName: user.firstName, 
             lastName: user.lastName, 
             isAdmin: user.isAdmin 
           });
         }
    } catch (error) {
        next(error);
    }
}

export default { createUser, loginUser };