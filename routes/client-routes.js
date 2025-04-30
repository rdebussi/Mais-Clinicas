// ✅ routes/client-routes.js
import express from 'express';
import * as ClientController from '../controllers/client-controller.js';
import { authMiddleware, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.post('/', ClientController.createClient);
router.get('/:id',  ClientController.getClientById);
router.patch('/:id', ClientController.updateClient);
router.delete('/:id',  ClientController.deleteClient);

export default router;
