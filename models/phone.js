export default (sequelize, DataTypes) => {
  const Phone = sequelize.define('Phone', {
    number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    clinicId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Clinics', // Tabela que estamos associando
        key: 'id'
      },
      onDelete: 'CASCADE' // Apagar telefones quando a clínica for deletada
    }
  });

  Phone.associate = (models) => {
    // Cada telefone pertence a uma clínica
    Phone.belongsTo(models.Clinic, {
      foreignKey: 'clinicId',
      as: 'clinic' // Alias para o relacionamento
    });
  };

  return Phone;
};
