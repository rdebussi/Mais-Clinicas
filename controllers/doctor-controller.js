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