// models/clinic.js
import bcrypt from 'bcrypt'

export default (sequelize, DataTypes) => {
  const Clinic = sequelize.define('Clinic', {
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
  },
  {
    hooks: {
      beforeCreate: async (clinic) => {
        if (clinic.password) {
          const salt = await bcrypt.genSalt(10);
          clinic.password = await bcrypt.hash(clinic.password, salt);
        }
      },
      beforeUpdate: async (clinic) => {
        if (clinic.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          clinic.password = await bcrypt.hash(clinic.password, salt);
        }
      }
    }
  },
  {});

  Clinic.associate = function(models) {
    Clinic.hasMany(models.Phone, {
      foreignKey: 'clinicId',
      as: 'phones' // Alias para referenciar os telefones da clínica
    });
    Clinic.hasMany(models.Doctor, {
      foreignKey: 'clinicId',
      as: 'doctors' // Alias para referenciar os médicos de uma clínica
    });
  };

  return Clinic;
};
