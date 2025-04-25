export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Phones', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    number: {
      type: Sequelize.STRING,
      allowNull: false
    },
    clinicId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Clinics', // Nome da tabela com a qual estamos associando
        key: 'id'
      },
      onDelete: 'CASCADE', // Deleta os telefones quando a clínica for removida
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('Phones');
}
