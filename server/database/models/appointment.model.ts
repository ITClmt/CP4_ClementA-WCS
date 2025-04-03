import mongoose, { Schema, type Document } from "mongoose";

export interface IAppointment extends Document {
  clientFirstName: string;
  clientLastName: string;
  clientEmail: string;
  date: Date;
  status: "En attente" | "Confirmé" | "Annulé";
}

const appointmentSchema = new Schema<IAppointment>(
  {
    clientFirstName: {
      type: String,
      required: true,
    },
    clientLastName: {
      type: String,
      required: true,
    },
    clientEmail: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["En attente", "Confirmé", "Annulé"],
      default: "En attente",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IAppointment>("Appointment", appointmentSchema);
