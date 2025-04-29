// models/doctor.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Doctor = sequelize.define('Doctor', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    specialty: {
      type: DataTypes.STRING,
      allowNull: false
    },
    crm: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    clinicId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  
  });

  Doctor.associate = function(models) {
    Doctor.belongsTo(models.Clinic, {
      foreignKey: 'clinicId',
      as: 'clinic'
    });
  };

  return Doctor;
};
