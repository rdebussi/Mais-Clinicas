import * as PhoneService from '../services/phone-service.js';

export const createPhone = async (req, res) => {
  try {
    const phone = await PhoneService.createPhone(req.body);
    res.status(201).json(phone);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getPhonesByClinic = async (req, res) => {
  try {
    const phones = await PhoneService.getPhonesByClinic(req.params.clinicId);
    res.status(200).json(phones);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deletePhone = async (req, res) => {
  try {
    await PhoneService.deletePhone(req.params.id);
    res.status(200).json({ message: 'Telefone deletado com sucesso' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
