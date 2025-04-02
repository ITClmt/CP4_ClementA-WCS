import type { RequestHandler } from "express";
import Appointment from "../../../database/models/appointment.model";

const isValidTimeSlot = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const validHours = [9, 10, 11, 14, 15, 16];
   
    const isValidHour = validHours.includes(hours)
    const isValidMinute = minutes === 0 || minutes === 30;
  
    return isValidHour && isValidMinute;
};
  
const createAppointment: RequestHandler = async (req, res, next) => {
    try {
      const { clientName, clientEmail, date } = req.body;
  
      if (!clientName || !clientEmail || !date) {
        res.status(400).json({ error: "Tous les champs sont requis" });
        return;
      }

      if (!isValidTimeSlot(date)) {
        res.status(400).json({ error: "Créneau invalide. Choisissez une heure valide." });
        return;
      }

      const existingAppointment = await Appointment.findOne({ date });

      if (existingAppointment) {
        res.status(400).json({ error: "Un rendez-vous existe déjà à cette date" });
        return;
      }
      
      const appointment = await Appointment.insertOne({clientName, clientEmail, date});

      // Format the response date in local timezone
      const responseAppointment = {
        ...appointment.toObject(),
        date: appointment.date.toLocaleString('fr-FR', {
          timeZone: 'Europe/Paris',
          dateStyle: 'full',
          timeStyle: 'short'
        })
      };
      
      res.status(201).json({ 
        message: "Rendez-vous créé avec succès", 
        appointment: responseAppointment 
      });
    } catch (error) {
      next(error);
    }
};

  const readAppointments: RequestHandler = async (req, res, next) => {
    try {
      const appointments = await Appointment.find().sort({ date: 1 }); // Trier par date

      const responseAppointments = appointments.map(appointment => ({
        ...appointment.toObject(),
        date: appointment.date.toLocaleString('fr-FR', {
          timeZone: 'Europe/Paris',
          dateStyle: 'full',
          timeStyle: 'short'
        })
      }));

      res.json(responseAppointments);
    } catch (error) {
      next(error);
    }
  };

  const readAppointmentById: RequestHandler = async (req, res, next) => {
    try {
      const appointment = await Appointment.findById(req.params.id);
  
      if (!appointment) {
        res.status(404).json({ error: "Rendez-vous non trouvé" });
        return;
      }

      const responseAppointment = {
        ...appointment.toObject(),
        date: appointment.date.toLocaleString('fr-FR', {
          timeZone: 'Europe/Paris',
          dateStyle: 'full',
          timeStyle: 'short'
        })
      };

      res.json(responseAppointment);
    } catch (error) {
      next(error);
    }
  };

  const updateAppointment: RequestHandler = async (req, res, next) => {
    try {
      const { date, status } = req.body;
  
      const appointment = await Appointment.findById(req.params.id);
  
      if (!appointment) {
        res.status(404).json({ error: "Rendez-vous non trouvé" });
        return;
      }

      if (date) appointment.date = date;
      if (status) appointment.status = status;
  
      await appointment.save();

      const responseAppointment = {
        ...appointment.toObject(),
        date: appointment.date.toLocaleString('fr-FR', {
          timeZone: 'Europe/Paris',
          dateStyle: 'full',
          timeStyle: 'short'
        })
      };
      res.json({ message: "Rendez-vous mis à jour", appointment: responseAppointment });
    } catch (error) {
      next(error);
    }
  };

  const deleteAppointment: RequestHandler = async (req, res, next) => {
    try {
      const appointment = await Appointment.findById(req.params.id);
  
      if (!appointment) {
        res.status(404).json({ error: "Rendez-vous non trouvé" });
        return;
      }
  
      await appointment.deleteOne();
      res.json({ message: "Rendez-vous supprimé avec succès" });
    } catch (error) {
      next(error);
    }
  };

export default { createAppointment, readAppointments, readAppointmentById, updateAppointment, deleteAppointment };