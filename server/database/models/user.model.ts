import mongoose, { Schema, Document } from 'mongoose';
import argon2 from 'argon2';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const hashingOptions = {
    type: argon2.argon2id,
    memoryCost: 19 * 2 ** 10,
    timeCost: 2,
    parallelism: 1,
  };

const userSchema = new Schema<IUser>({
  firstName: { 
    type: String, 
    required: true, 
    minlength: 2,
    maxlength: 50
  },
  lastName: { 
    type: String, 
    required: true, 
    minlength: 2,
    maxlength: 50
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/.+\@.+\..+/, "Veuillez entrer une adresse email valide"],
    lowercase: true
  },
  password: { 
    type: String, 
    required: true, 
    minlength: 8
  },
  isAdmin: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true
});

// 🔐 Hash password before saving user
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    this.password = await argon2.hash(this.password, hashingOptions);
    next();
  });
  
  // 🔐 Vérification du mot de passe
  userSchema.methods.comparePassword = async function (candidatePassword: string) {
    return await argon2.verify(this.password, candidatePassword);
  };

export default mongoose.model<IUser>('User', userSchema);