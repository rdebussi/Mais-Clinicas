// models/clinic.js
import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
  const Clinic = sequelize.define('Clinic', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cnpj: {
      type: DataTypes.STRING(18), // Formato '00.000.000/0000-00'
      allowNull: false,
      unique: true,
      validate: {
        len: [14, 18] // Aceita só o formato correto (com ou sem máscara)
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true // Garante que é email válido
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(2), // Ex: 'SP', 'RJ'
      allowNull: false
    },
    zipCode: {
      type: DataTypes.STRING(9), // Ex: '12345-678'
      allowNull: false
    }
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
  });

  Clinic.associate = function(models) {
    Clinic.hasMany(models.Phone, {
      foreignKey: 'clinicId',
      as: 'phones'
    });
    Clinic.hasMany(models.Doctor, {
      foreignKey: 'clinicId',
      as: 'doctors'
    });
  };

  return Clinic;
};
