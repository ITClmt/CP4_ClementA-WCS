import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

const verify: RequestHandler = async (req, res, next) => {
    if (!process.env.JWT_SECRET) {
      throw new Error("Vous n'avez pas configuré votre JWT SECRET dans le .env");
    }
  
    try {
      const { CP4auth } = req.cookies;
  
      if (!CP4auth) {
        res.sendStatus(403);
      }
  
      const resultPayload = jwt.verify(CP4auth, process.env.JWT_SECRET as string);
  
      if (typeof resultPayload !== "object") {
        throw new Error("Token invalid");
      }
  
      req.user = {
        id: resultPayload.userId,
        name: resultPayload.name,
        email: resultPayload.email,
        isAdmin: resultPayload.isAdmin,
      };
  
      next();
    } catch (error) {
      next(error);
    }
  };

  const checkAdmin: RequestHandler = async (req, res, next) => {
    if (!req.user?.isAdmin) {
      res.status(403).json({ message: "Accès refusé" });
    }
  
    next();
  };

export default { verify, checkAdmin };