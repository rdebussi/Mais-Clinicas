// models/appointment.js
import { DataTypes, Op } from 'sequelize';

export default (sequelize) => {
  const Appointment = sequelize.define('Appointment', {
    schedule: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('agendada', 'cancelada', 'realizada', 'pendente'),
      allowNull: false,
      defaultValue: 'agendada'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    hooks: {
      beforeCreate: async (appointment) => {
        // Horário deve ser no futuro
        if (new Date(appointment.schedule) <= new Date()) {
          throw new Error('O horário da consulta deve estar no futuro.');
        }
        // Verifica conflito com outro agendamento no mesmo horário para o mesmo médico
        const conflict = await sequelize.models.Appointment.findOne({
          where: {
            doctorId: appointment.doctorId,
            schedule: appointment.schedule
          }
        });

        if (conflict) {
          throw new Error('Já existe uma consulta marcada com esse médico neste horário.');
        }
        const clientConflict = await sequelize.models.Appointment.findOne({
          where: {
            clientId: appointment.clientId,
            schedule: appointment.schedule
          }
        });
        if (clientConflict) {
          throw new Error('O cliente já possui uma consulta marcada nesse horário.');
        }
      },
      
      beforeUpdate: async (appointment) => {
        if (appointment.changed('schedule') || appointment.changed('clientId')) {
          const clientConflict = await sequelize.models.Appointment.findOne({
            where: {
              clientId: appointment.clientId,
              schedule: appointment.schedule,
              id: { [Op.ne]: appointment.id }
            }
          });
          if (clientConflict) {
            throw new Error('O cliente já possui uma consulta marcada nesse horário.');
        }}
        if (new Date(appointment.schedule) <= new Date()) {
          throw new Error('O horário da consulta deve estar no futuro.');
        }
        // Verifica se está alterando horário ou médico
        if (appointment.changed('schedule') || appointment.changed('doctorId')) {
          const conflict = await sequelize.models.Appointment.findOne({
            where: {
              doctorId: appointment.doctorId,
              schedule: appointment.schedule,
              id: { [Op.ne]: appointment.id } // exclui a própria consulta
            }
          });
          if (conflict) {
            throw new Error('Já existe uma consulta marcada com esse médico neste horário.');
          }
        }

      }
    }
  });

  Appointment.associate = function(models) {
    Appointment.belongsTo(models.Client, {
      foreignKey: 'clientId',
      as: 'client',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });

    Appointment.belongsTo(models.Doctor, {
      foreignKey: 'doctorId',
      as: 'doctor',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });

    Appointment.belongsTo(models.Clinic, {
      foreignKey: 'clinicId',
      as: 'clinic',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  };

  return Appointment;
};
