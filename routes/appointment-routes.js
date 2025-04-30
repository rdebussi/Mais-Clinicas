import express from 'express';
import * as AppointmentController from '../controllers/appointment-controller.js';
import { authMiddleware, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.post('/', AppointmentController.createAppointment);
router.get('/:id',  AppointmentController.getAppointmentById);
router.patch('/:id', AppointmentController.updateAppointment);
router.delete('/:id', AppointmentController.deleteAppointment);
router.get('/', AppointmentController.getAppointments);


export default router;
