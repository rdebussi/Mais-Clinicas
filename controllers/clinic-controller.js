import * as ClinicService from '../services/clinic-service.js';

export const createClinic = async (req, res) => {
  try {
    const clinic = await ClinicService.createClinic(req.body);
    res.status(201).json(clinic);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllClinics = async (_req, res) => {
  const clinics = await ClinicService.getAllClinics();
  res.json(clinics);
};

export const getClinicById = async (req, res) => {
  const clinic = await ClinicService.getClinicById(req.params.id);
  if (!clinic) return res.status(404).json({ error: 'Clinic not found' });
  res.json(clinic);
};

export const updateClinic = async (req, res) => {
  try {
    const clinic = await ClinicService.updateClinic(req.params.id, req.body);
    const newData = await ClinicService.getClinicById(req.params.id)
    res.status(200).json(newData);
  } catch(e) {
    res.status(400).json({error: e.message});
  }
}

export const deleteClinic = async (req, res) => {
  try {
    const clinic = await ClinicService.deleteClinic(req.params.id)
    res.status(200).json(clinic);
  } catch(e){
    res.status(400).json({error: e.message})
  }
}