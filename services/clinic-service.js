// src/services/clinicService.js
import db from '../models/index.js';

export const createClinic = async (data) => {
  return await db.Clinic.create(data);
};

export const getAllClinics = async () => {
  return await db.Clinic.findAll({
    include: [
      {
        model: db.Doctor,
        as: 'doctors'
      },
      {
        model: db.Phone,
        as: 'phones'
      }
    ],
    attributes: { exclude: ['password'] }
  });
};

export const getClinicById = async (id) => {
  return await db.Clinic.findByPk(id, {
    include: [
      {
        model: db.Doctor,
        as: 'doctors'
      },
      {
        model: db.Phone,
        as: 'phones'
      }
    ],
    attributes: { exclude: ['password'] }
  });
};

export const updateClinic = async (id, data) => {
    try {
      const existingClinic = await db.Clinic.findByPk(id)
      if(!existingClinic){
        throw new Error('clinic not found')
      }
      if(data.password != existingClinic.password){
        throw new Error('incorrect password')
      }
      const clinic = await db.Clinic.update(data, {where: {id}})
      return clinic
    } catch(e) {
      throw e;
    }
}

export const deleteClinic = async (id) => {
  try {
    const existingClinic = await db.Clinic.findByPk(id)
    if(!existingClinic){
      throw new Error('clinic not found')
    }
    await db.Clinic.destroy({where: {id}});
    return true;
  } catch(e) {
    throw e;
  }
}