import express from "express";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define auth routes
import authUserActions from "./modules/auth/authUserActions";

router.post("/api/auth/login", authUserActions.login);
router.post("/api/auth/logout", authUserActions.logout);

// Appointment routes

import appointmentActions from "./modules/appointment/appointmentActions";
import authMiddleware from "./middleware/authMiddleware";

router.post("/api/appointments", appointmentActions.createAppointment);
router.get("/api/appointments", authMiddleware.verify, authMiddleware.checkAdmin, appointmentActions.readAppointments);
router.get("/api/appointments/:id", authMiddleware.verify, authMiddleware.checkAdmin, appointmentActions.readAppointmentById);
router.put("/api/appointments/:id", authMiddleware.verify, authMiddleware.checkAdmin, appointmentActions.updateAppointment);
router.delete("/api/appointments/:id", authMiddleware.verify, authMiddleware.checkAdmin, appointmentActions.deleteAppointment);



/* ************************************************************************* */

export default router;
