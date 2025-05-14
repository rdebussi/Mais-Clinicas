// ✅ controllers/client-controller.js
import * as ClientService from '../services/client-service.js';

export const createClient = async (req, res) => {
  try {
    const client = await ClientService.createClient(req.body);
    res.status(201).json(client);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const findClient = async (req, res) => {
  const { chatId } = req.query;
  try {
    const client = await ClientService.findClient(chatId);
    res.status(200).json(client)
  } catch(e) {
    res.status(400).json({ error: e.message})
  }
}

export const getClientById = async (req, res) => {
  try {
    const client = await ClientService.getClientById(req.params.id);
    res.status(200).json(client);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};

export const updateClient = async (req, res) => {
  try {
    const updated = await ClientService.updateClient(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const deleteClient = async (req, res) => {
  try {
    await ClientService.deleteClient(req.params.id);
    res.status(204).send();
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const changeClientPassword = async (req, res) => {
  const { id } = req.params;
  const { password, newPassword } = req.body;

  try {
    await ClientService.changeClientPassword(id, password, newPassword);
    res.status(200).json({ message: 'Senha atualizada com sucesso.' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};