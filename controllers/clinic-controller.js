import * as ClinicService from '../services/clinic-service.js';

export const createClinic = async (req, res) => {
  try {
    const clinic = await ClinicService.createClinic(req.body);
    res.status(201).json(clinic);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllClinics = async (req, res) => {
  const { page = 1, limit = 10, orderBy = 'name', sortOrder = 'ASC', name } = req.query;

  try {
    const clinicsData = await ClinicService.getAllClinics({ page, limit, orderBy, sortOrder, name });
    res.status(200).json(clinicsData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
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

export const changeClinicPassword = async (req, res) => {
  const { id } = req.params
  const { password, newPassword} = req.body
  try {
    await ClinicService.changeClinicPassword(id, password, newPassword)
    res.status(200).json({message: 'Senha atualizada com sucesso.'})
  } catch (e) {
    res.status(400).json({error: e.message})
  }
}