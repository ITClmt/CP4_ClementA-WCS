import type { RequestHandler } from "express";
import User from "../../../database/models/user.model";
import jwt from "jsonwebtoken";

const loginAdmin: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ error: "Identifiants invalides" });
    } else if (!user.isAdmin) {
      res.status(403).json({ error: "Accès refusé" });
    } else {
      const payload = {
        userId: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin,
      };

      if (!process.env.JWT_SECRET) {
        throw new Error(
          "Vous n'avez pas configuré votre JWT SECRET dans le .env",
        );
      }

      const isProduction = process.env.NODE_ENV === "production";

      const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: "1y",
      });
      res
        .cookie("CP4auth", token, {
          httpOnly: true,
          sameSite: isProduction ? "none" : "lax",
          secure: isProduction, // true en prod, false en dev
          maxAge: 31536000000, // 1 an
        })
        .json({
          message: "Connexion réussie",
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin,
        });
    }
  } catch (error) {
    next(error);
  }
};

export default { loginAdmin };
