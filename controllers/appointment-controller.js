import * as AppointmentService from '../services/appointment-service.js';

export const createAppointment = async (req, res) => {
  try {
    const appointment = await AppointmentService.createAppointment(req.body);
    res.status(201).json(appointment);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await AppointmentService.getAppointmentById(req.params.id);
    res.status(200).json(appointment);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const updated = await AppointmentService.updateAppointment(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const result = await AppointmentService.deleteAppointment(req.params.id);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const { doctorId, clinicId, clientId } = req.query;
    const appointments = await AppointmentService.getAppointments({ doctorId, clinicId, clientId });
    res.json(appointments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

