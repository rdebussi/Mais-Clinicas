// src/services/clinicService.js
import db from '../models/index.js';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';


export const createClinic = async (data) => {
  try{
    const existingClinic = await db.Clinic.findOne({where: {cnpj: data.cnpj}})
    if(existingClinic) throw new Error('Já existe uma clínica com esse CNPJ cadastrado')
    const clinic =  await db.Clinic.create(data);
    return clinic;
  } catch(e){
    throw e;
  }
  };

export const getAllClinics = async ({ page = 1, limit = 10, orderBy = 'name', sortOrder = 'ASC', name }) => {
  const offset = (page - 1) * limit;
  // Cria dinamicamente o objeto where
  const where = {};

  if (name) {
    where.name = { [Op.like]: `%${name}%` }; // busca "nome contém ..."
  }

  try {
    const { count, rows } = await db.Clinic.findAndCountAll({
      where,
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
      attributes: { exclude: ['password'] },
      order: [[orderBy, sortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return {
      totalClinics: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      clinics: rows
    };
  } catch (error) {
    throw new Error('Erro ao buscar clínicas');
  }
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
    const existingClinic = await db.Clinic.findByPk(id);
    if (!existingClinic) {
      throw new Error('clinic not found');
    }

    const isPasswordCorrect = await bcrypt.compare(
      data.password,
      existingClinic.password
    );
    if (!isPasswordCorrect) {
      throw new Error('incorrect password');
    }
    // Cria um novo objeto apenas com os campos que serão atualizados
    const updateData = { ...data };
    delete updateData.password;     // só serviu para validação
    const [affected] = await db.Clinic.update(updateData, { where: { id } });
    return affected;

  } catch (e) {
    throw e;
  }
  
};


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

export const changeClinicPassword = async (id, oldPassword, newPassword) => {
  const clinic = await db.Clinic.findByPk(id);
  if(!clinic) throw new Error('Clinica nao encontrada');
  const isPasswordCorrect = await bcrypt.compare(oldPassword, clinic.password);
  if(!isPasswordCorrect) throw new Error('Senha atual incorreta!');
  clinic.password = newPassword;
  await clinic.save();
  return true;
}