import { Router } from 'express';
import * as PhoneController from '../controllers/phone-controller.js';

const router = Router();

// POST /phones
router.post('/', PhoneController.createPhone);

// GET /phones/clinic/:clinicId
router.get('/clinic/:clinicId', PhoneController.getPhonesByClinic);

// DELETE /phones/:id
router.delete('/:id', PhoneController.deletePhone);

export default router;
