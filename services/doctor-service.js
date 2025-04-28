import db from '../models/index.js';

export const createDoctor = async (data) => {
    const { crm, clinicId } = data;
    try {
        const existingClinic = await db.Clinic.findByPk(clinicId)
            if(!existingClinic){
              throw new Error('clinic not found')
            }
        const existingDoctor = await db.Doctor.findOne({where: {crm}})
        if(existingDoctor){
            throw new Error ('a doctor with this CRM already exists');
        }
        const doctor = await db.Doctor.create(data)
        return doctor;
    } catch(e) {
        throw e;
    }
}