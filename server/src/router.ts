import express from "express";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define auth routes
import authUserActions from "./modules/auth/authUserActions";

router.post("/api/auth/login", authUserActions.loginAdmin);
router.post("/api/auth/logout", authUserActions.logoutAdmin);

// Appointment routes

import appointmentActions from "./modules/appointment/appointmentActions";
import authMiddleware from "./middleware/authMiddleware";

router.post("/api/appointments", authMiddleware.verify, appointmentActions.createAppointment);
router.get("/api/appointments", authMiddleware.verify, authMiddleware.checkAdmin, appointmentActions.readAppointments);
router.get("/api/appointments/:email", authMiddleware.verify, appointmentActions.readAppointmentsByEmail);
router.get("/api/appointments/:id", authMiddleware.verify, authMiddleware.checkAdmin, appointmentActions.readAppointmentById);
router.put("/api/appointments/:id", authMiddleware.verify, authMiddleware.checkAdmin, appointmentActions.updateAppointment);
router.delete("/api/appointments/:id", authMiddleware.verify, authMiddleware.checkAdmin, appointmentActions.deleteAppointment);
router.delete("/api/users/appointments/:id", authMiddleware.verify, appointmentActions.deleteUserAppointments);

// User routes

import userActions from "./modules/user/userActions";

router.post("/api/users", userActions.createUser);
router.post("/api/users/login", userActions.loginUser);


/* ************************************************************************* */

export default router;
