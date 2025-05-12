import db from '../models/index.js';
import { Op } from 'sequelize';
import { format } from 'date-fns-tz';

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

export const findDoctors = async (clinicId, specialty, page = 1, limit = 10, orderBy = 'name', sortOrder = 'ASC') => {
  const where = {};
  if (clinicId) {
    where.clinicId = clinicId;
  }
  if (specialty) {
    const specialtyList = specialty.split(',').map(item => item.trim());
    where.specialty = specialtyList.length > 1 ? { [Op.in]: specialtyList } : specialtyList[0];
  }
  try {
    const doctors = await db.Doctor.findAll({
      where,
      limit: parseInt(limit, 10),
      offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
      order: [[orderBy, sortOrder]],
      include: [
        {
          model: db.Clinic,
          as: 'clinic',
          attributes: ['name']
        }
      ]
    });
    return doctors;
  } catch (e) {
    throw e;
  }
};


//telegram
const START_HOUR = 9;
const END_HOUR = 19;
const SLOT_DURATION_MINUTES = 40;

function generateTimeSlots(date) {
    const slots = [];
    const base = new Date(`${date}T${String(START_HOUR).padStart(2, '0')}:00:00`); // sem o 'Z'
  
    let current = new Date(base);
  
    while (current.getHours() < END_HOUR) {
      slots.push(new Date(current));
      current.setMinutes(current.getMinutes() + SLOT_DURATION_MINUTES);
    }
  
    return slots;
  }
  
  

export const getAvailableSlots = async (doctorId, date) => {
  const doctor = await db.Doctor.findByPk(doctorId);
  if (!doctor) throw new Error('Médico não encontrado');

  const day = new Date(date);
  if (day.getDay() === 0) throw new Error('Domingo não é permitido');

  const feriados = []; // ex: ['2025-01-01']
  if (feriados.includes(date)) throw new Error('Data é feriado');

  const allSlots = generateTimeSlots(date);

  const startDay = new Date(`${date}T00:00:00`);
  const endDay = new Date(`${date}T23:59:59`);

  const consultas = await db.Appointment.findAll({
    where: {
      doctorId,
      schedule: { [Op.between]: [startDay, endDay] }
    }
  });

  const indisponivel = await db.UnavailableDate.findOne({
    where: {
      doctorId,
      startDate: { [Op.lte]: endDay },
      endDate: { [Op.gte]: startDay }
    }
  });

  if (indisponivel) throw new Error(`O médico está indisponível (${indisponivel.type})`);

  function formatHourMin(date) {
    return date.toISOString().slice(11, 16); // sempre UTC: HH:MM
  }
  
  
  const ocupados = consultas.map(c => formatHourMin(new Date((c.schedule) + 3 * 60 * 60)));
  
  const livres = allSlots.filter(slot => {
    const formatted = formatHourMin(slot);
    console.log('Ocupados:', ocupados);
    console.log('Todos slots:', allSlots.map(formatHourMin));
    return !ocupados.includes(formatted);
  });  

  return {
    doctorId: Number(doctorId),
    date,
    availableSlots: livres.map(s =>
        format(s, 'HH:mm', { timeZone: 'America/Sao_Paulo' })
      )
    };
};

