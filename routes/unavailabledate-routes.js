import { Router } from 'express';
import * as UnavailableDateController from '../controllers/unavailabledate-controller.js';

const router = Router();

// POST /unavailable
router.post('/', UnavailableDateController.createUnavailableDate);

// GET /unavailable/doctor/:doctorId
router.get('/doctor/:doctorId', UnavailableDateController.getUnavailableDatesByDoctor);

// DELETE /unavailable/:id
router.delete('/:id', UnavailableDateController.deleteUnavailableDate);

export default router;
