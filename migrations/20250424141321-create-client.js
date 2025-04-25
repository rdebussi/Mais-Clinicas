export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Clients', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false
    },
    clinicId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Clinics', // Relacionamento com a tabela Clinics
        key: 'id'
      },
      onDelete: 'SET NULL', // Quando a clínica for deletada, o campo clinicId será nulo
      allowNull: true
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
  await queryInterface.dropTable('Clients');
}
