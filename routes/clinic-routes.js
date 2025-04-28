// src/routes/clinicRoutes.js
import express from 'express';
import * as ClinicController from '../controllers/clinic-controller.js';
import { authMiddleware, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

//criação da clínica
router.post('/', ClinicController.createClinic);

//client vai acessar ----------
router.get('/', ClinicController.getAllClinics);
router.get('/:id',  ClinicController.getClinicById);
//---------------- ----------

//clinic vai usar --------------
router.patch('/:id', authMiddleware, authorizeRoles('clinic'), ClinicController.updateClinic);
router.delete('/:id', authMiddleware, authorizeRoles('clinic'), ClinicController.deleteClinic);
//----------------------------

//ambos vão usar
router.get('/:id/doctors', ClinicController.findDoctors);

export default router;
