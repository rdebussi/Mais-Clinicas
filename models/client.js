// models/client.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Client = sequelize.define('Client', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  Client.associate = function(models) {
    Client.hasMany(models.Appointment, {
      foreignKey: 'clientId',
      as: 'appointments' // Um cliente pode ter vários agendamentos
    });
  }

  return Client;
};
