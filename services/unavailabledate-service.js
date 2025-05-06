import db from '../models/index.js';

export const createUnavailableDate = async (data) => {
  const { doctorId, startDate, endDate, type } = data;

  if (!doctorId || !startDate || !endDate || !type) {
    throw new Error('Campos obrigatórios: doctorId, startDate, endDate e type');
  }

  const doctor = await db.Doctor.findByPk(doctorId);
  if (!doctor) throw new Error('Médico não encontrado');

  const created = await db.UnavailableDate.create(data);
  return created;
};

export const getUnavailableDatesByDoctor = async (doctorId) => {
  const list = await db.UnavailableDate.findAll({
    where: { doctorId },
    attributes: ['id', 'startDate', 'endDate', 'type'],
    order: [['startDate', 'ASC']]
  });

  return list;
};

export const deleteUnavailableDate = async (id) => {
  const record = await db.UnavailableDate.findByPk(id);
  if (!record) throw new Error('Indisponibilidade não encontrada');
  await record.destroy();
};
