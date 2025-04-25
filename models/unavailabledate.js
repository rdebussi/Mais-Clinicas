// models/unavailabledate.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const UnavailableDate = sequelize.define('UnavailableDate', {
    doctorId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Doctors',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  UnavailableDate.associate = function(models) {
    UnavailableDate.belongsTo(models.Doctor, {
      foreignKey: 'doctorId',
      as: 'doctor'
    });
  };

  return UnavailableDate;
};
