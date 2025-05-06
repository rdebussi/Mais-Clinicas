import db from '../models/index.js';

export const createPhone = async (data) => {
  if (!data.clinicId || !data.number) {
    throw new Error('clinicId e number são obrigatórios');
  }

  const clinic = await db.Clinic.findByPk(data.clinicId);
  if (!clinic) throw new Error('Clínica não encontrada');

  const phone = await db.Phone.create(data);
  return phone;
};

export const getPhonesByClinic = async (clinicId) => {
  const phones = await db.Phone.findAll({
    where: { clinicId },
    attributes: ['id', 'number']
  });
  return phones;
};

export const deletePhone = async (id) => {
  const phone = await db.Phone.findByPk(id);
  if (!phone) throw new Error('Telefone não encontrado');
  await phone.destroy();
};
