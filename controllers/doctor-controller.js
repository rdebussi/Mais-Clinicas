import * as DoctorService from '../services/doctor-service.js'

export const createDoctor = async (req, res) => {
    //validar os dados do front com o yup
    try{
        const doctor = await DoctorService.createDoctor(req.body);
        res.status(201).json(doctor);
    }   catch(e) {
        res.status(400).json({error: e.message})
    }
}

export const findDoctors = async (req, res) => {
  const { clinicId, specialty, page = 1, limit = 10, orderBy = 'name', sortOrder = 'ASC' } = req.query;
  
  try {
    const doctors = await DoctorService.findDoctors(clinicId, specialty, page, limit, orderBy, sortOrder);
    res.status(200).json(doctors);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const getDoctorById = async (req, res) => {
    const { id } = req.params
    try {
        const doctor = await DoctorService.getDoctorById(id)
        res.status(201).json(doctor)
    } catch(e) {
        res.status(400).json({error: e.message})
    }
}

export const updateDoctor = async (req, res) => {
    try {
        await DoctorService.updateDoctor(req.params.id, req.body)
        const newData = await DoctorService.getDoctorById(req.params.id)
        res.status(200).json(newData);
    } catch(e){
        res.status(400).json({error: e.message});
    }
}

export const deleteDoctor = async (req, res) => {
    try {
        const clinic = await DoctorService.deleteDoctor(req.params.id)
        res.status(200).json(clinic)
    } catch(e) {
        res.status(400).json({error: e.message})
    }
}

export const getAvailableSlots = async (req, res) => {
    try {
      const { doctorId } = req.params;
      const { date } = req.query;
      if (!date) return res.status(400).json({ error: 'Data é obrigatória no formato YYYY-MM-DD' });
  
      const slots = await DoctorService.getAvailableSlots(doctorId, date);
      res.json(slots);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  