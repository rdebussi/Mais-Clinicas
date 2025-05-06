import * as UnavailableDateService from '../services/unavailabledate-service.js';

export const createUnavailableDate = async (req, res) => {
  try {
    const data = await UnavailableDateService.createUnavailableDate(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getUnavailableDatesByDoctor = async (req, res) => {
  try {
    const list = await UnavailableDateService.getUnavailableDatesByDoctor(req.params.doctorId);
    res.status(200).json(list);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteUnavailableDate = async (req, res) => {
  try {
    await UnavailableDateService.deleteUnavailableDate(req.params.id);
    res.status(200).json({ message: 'Indisponibilidade removida com sucesso' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
