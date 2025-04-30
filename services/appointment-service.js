// services/appointment-service.js
import db from '../models/index.js';
import { Op } from 'sequelize';

export const createAppointment = async (data) => {
  const { clientId, doctorId, schedule } = data;

  const doctor = await db.Doctor.findByPk(doctorId);
  if (!doctor) throw new Error('Médico não encontrado');

  const client = await db.Client.findByPk(clientId);
  if (!client) throw new Error('Cliente não encontrado');

  const existingAppointment = await db.Appointment.findOne({
    where: {
      clientId,
      schedule
    }
  });
  if (existingAppointment) throw new Error('O cliente já possui uma consulta marcada neste horário');

  const appointment = await db.Appointment.create(data);
  return appointment;
};

export const getAppointmentById = async (id) => {
  const appointment = await db.Appointment.findByPk(id, {
    include: [
      {
        model: db.Doctor,
        as: 'doctor'
      },
      {
        model: db.Client,
        as: 'client'
      }
    ]
  });
  if (!appointment) throw new Error('Consulta não encontrada');
  return appointment;
};

export const updateAppointment = async (id, data) => {
  const appointment = await db.Appointment.findByPk(id);
  if (!appointment) throw new Error('Consulta não encontrada');

  if (data.schedule || data.clientId) {
    const conflict = await db.Appointment.findOne({
      where: {
        clientId: data.clientId || appointment.clientId,
        schedule: data.schedule || appointment.schedule,
        id: { [Op.ne]: id }
      }
    });
    if (conflict) throw new Error('O cliente já possui uma consulta nesse horário');
  }

  await db.Appointment.update(data, { where: { id } });
  return await getAppointmentById(id);
};

export const deleteAppointment = async (id) => {
  const appointment = await db.Appointment.findByPk(id);
  if (!appointment) throw new Error('Consulta não encontrada');
  await db.Appointment.destroy({ where: { id } });
  return true;
};
