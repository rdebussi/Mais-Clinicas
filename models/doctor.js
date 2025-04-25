// models/doctor.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Doctor = sequelize.define('Doctor', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    specialty: {
      type: DataTypes.STRING,
      allowNull: false
    },
    crm: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  });

  Doctor.associate = function(models) {
    Doctor.belongsTo(models.Clinic, { foreignKey: 'clinicId', as: 'clinic' });
  }

  return Doctor;
};
