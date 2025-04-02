import type { RequestHandler } from "express";
import Appointment from "../../../database/models/appointment.model";

const isValidTimeSlot = (date: Date) => {
    const appointmentDate = new Date(date);
    const hours = appointmentDate.getHours();
    const minutes = appointmentDate.getMinutes();
  
    // Heures valides : 9h-12h et 14h-17h
    const validHours = [9, 10, 11, 14, 15, 16];
   
    
    // Vérifie si l'heure est valide
    const isValidHour = validHours.includes(hours)
    const isValidMinute = minutes === 0 || minutes === 30;
  
    // Pas de RDV entre 12h et 14h
    if (hours >= 12 && hours < 14) {
      return false;
    }
  
    return isValidHour && isValidMinute;
  };
  
const createAppointment: RequestHandler = async (req, res, next) => {
    try {
      const { clientName, clientEmail, date } = req.body;
  
      if (!clientName || !clientEmail || !date) {
        res.status(400).json({ error: "Tous les champs sont requis" });
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
  
      const appointment = new Appointment({ clientName, clientEmail, date });
  
      await appointment.save();
      res.status(201).json({ message: "Rendez-vous créé avec succès", appointment });
    } catch (error) {
      next(error);
    }
  };

  const readAppointments: RequestHandler = async (req, res, next) => {
    try {
      const appointments = await Appointment.find().sort({ date: 1 }); // Trier par date
      res.json(appointments);
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
  
      res.json(appointment);
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
      res.json({ message: "Rendez-vous mis à jour", appointment });
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