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

export const getDoctorById = async (id) => {
    try {
        const existingDoctor = await db.Doctor.findByPk(id);
        if(!existingDoctor) throw new Error('Médico não encontrado')
        const doctor = await db.Doctor.findByPk(id, {
            include: [
                {
                    model: db.Clinic,
                    as: 'clinic',
                    attributes: ['name', 'address'],
                    include : [
                        {
                            model: db.Phone,
                            as: 'phones'
                        }
                    ]
                }
            ],
            attributes: {exclude: ['password']}
        });
        return doctor
    } catch(e){
        throw e;
    }
} 

export const updateDoctor = async (id, data) => {
    try {
        const existingDoctor = await db.Doctor.findByPk(id);
        if(!existingDoctor) throw new Error('Médico não encontrado');
        const updated = await db.Doctor.update(data, {where: {id}})
        return updated;
    } catch(e){
        throw e;
    }
}

export const deleteDoctor = async (id) => {
    try{
        const existingDoctor = await db.Doctor.findByPk(id);
        if(!existingDoctor) throw new Error('Médico não encontrado');
        await db.Doctor.destroy({where: {id}})
        return true
    } catch(e) {
        throw e
    }
}

