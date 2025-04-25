// models/appointment.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Appointment = sequelize.define('Appointment', {
    schedule: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Appointment.associate = function(models) {
    Appointment.belongsTo(models.Client, {
      foreignKey: 'clientId',
      as: 'client'
    });
  
    Appointment.belongsTo(models.Doctor, {
      foreignKey: 'doctorId',
      as: 'doctor', // boa prática dar um alias
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      constraints: true
    });
  };
  

  return Appointment;
};
