// ✅ routes/client-routes.js
import express from 'express';
import * as ClientController from '../controllers/client-controller.js';
import { authMiddleware, authorizeRoles } from '../middleware/auth.js';
import db from '../models/index.js';

const router = express.Router();

router.post('/', ClientController.createClient);
router.patch('/:id', ClientController.updateClient);
router.delete('/:id',  ClientController.deleteClient);
router.patch('/:id/password',  ClientController.changeClientPassword);

router.get('/', async (req, res) => {
    const { chatId, cpf } = req.query;
    console.log(chatId)
    let client;
  
    if (chatId) {
      client = await db.Client.findOne({ where: { chatId } });
      console.log("1 -", client)
    } else if (cpf) {
      client = await db.Client.findOne({ where: { cpf } });
    }
  
    if (!client) {
      return res.status(404).json({});
    }

    console.log(client)
    return res.status(200).json(client);
  });
  
  router.get('/:id',  ClientController.getClientById);


export default router;
