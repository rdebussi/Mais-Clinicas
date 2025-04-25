// migrations/[timestamp]-create-unavailable-date.js
import { DataTypes } from 'sequelize';

export default {
  async up(queryInterface) {
    await queryInterface.createTable('UnavailableDates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
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
        type: DataTypes.STRING, // "folga" ou "férias"
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('UnavailableDates');
  }
};
