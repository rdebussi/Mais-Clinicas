import express from 'express';
import * as DoctorController from '../controllers/doctor-controller.js';
import { authMiddleware, authorizeRoles } from '../middleware/auth.js';

const router = express.Router()

router.post('/',  DoctorController.createDoctor);
router.get('/', DoctorController.findDoctors);
router.get('/:id', DoctorController.getDoctorById);
router.patch('/:id', authMiddleware, authorizeRoles('clinic'), DoctorController.updateDoctor);
router.delete('/:id', authMiddleware, authorizeRoles('clinic'), DoctorController.deleteDoctor)

export default router;