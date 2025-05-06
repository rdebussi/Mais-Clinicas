// services/appointment-service.js
import db from '../models/index.js';
import { Op } from 'sequelize';

export const createAppointment = async (data) => {
  const { clientId, doctorId, schedule } = data;
  // Verifica se a data é um domingo
  const dayOfWeek = new Date(schedule).getDay(); // 0 = domingo, 6 = sábado
  if (dayOfWeek === 0) {
    throw new Error('Não é possível agendar consultas aos domingos.');
  }
  const doctor = await db.Doctor.findByPk(doctorId);
  if (!doctor) throw new Error('Médico não encontrado');
  const client = await db.Client.findByPk(clientId);
  if (!client) throw new Error('Cliente não encontrado');
  // Verifica indisponibilidade do médico
  const isUnavailable = await db.UnavailableDate.findOne({
    where: {
      doctorId,
      startDate: { [Op.lte]: schedule },
      endDate: { [Op.gte]: schedule }
    }
  });
  if (isUnavailable) {
    throw new Error(`O médico está indisponível neste horário (${isUnavailable.type})`);
  }
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
        model: db.Clinic,
        as: 'clinic'
      },
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
  const newSchedule = data.schedule || appointment.schedule;
  const newDoctorId = data.doctorId || appointment.doctorId;
  const newClientId = data.clientId || appointment.clientId;
  // Verifica se a data é um domingo
  const dayOfWeek = new Date(newSchedule).getDay(); // 0 = domingo, 6 = sábado
  if (dayOfWeek === 0) {
    throw new Error('Não é possível agendar consultas aos domingos.');
  }

  // Verifica indisponibilidade do médico
  const isUnavailable = await db.UnavailableDate.findOne({
    where: {
      doctorId: newDoctorId,
      startDate: { [Op.lte]: newSchedule },
      endDate: { [Op.gte]: newSchedule }
    }
  });
  if (isUnavailable) {
    throw new Error(`O médico está indisponível neste horário (${isUnavailable.type})`);
  }
  // Verifica conflito de cliente no novo horário
  if (data.schedule || data.clientId) {
    const conflict = await db.Appointment.findOne({
      where: {
        clientId: newClientId,
        schedule: newSchedule,
        id: { [Op.ne]: id }
      }
    });
    if (conflict) throw new Error('O cliente já possui uma consulta nesse horário');
  }
  await db.Appointment.update(data, { where: { id } });
  return await getAppointmentById(id);
};



export const getAppointments = async ({ doctorId, clinicId, clientId }) => {
  const where = {};
  if (doctorId) where.doctorId = doctorId;
  if (clinicId) where.clinicId = clinicId;
  if (clientId) where.clientId = clientId;

  const appointments = await db.Appointment.findAll({
    where,
    include: [
      { model: db.Doctor, as: 'doctor' },
      { model: db.Client, as: 'client' },
      { model: db.Clinic, as: 'clinic' }
    ],
    order: [['schedule', 'ASC']]
  });

  return appointments;
};
