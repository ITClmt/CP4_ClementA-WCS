import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
  clientName: string;
  clientEmail: string;
  date: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
}

const appointmentSchema = new Schema<IAppointment>({
  clientName: { 
    type: String, 
    required: true 
  },
  clientEmail: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending' 
  }
}, {
  timestamps: true
});

export default mongoose.model<IAppointment>('Appointment', appointmentSchema);