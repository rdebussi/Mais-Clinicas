// src/app.js
import express from 'express';
import routes from './routes/index.js';
import db from './models/index.js';


const app = express();
app.use(express.json());
app.use(routes);


// async function alterTable() {
//   try {
//     await db.query("ALTER TABLE `Appointments` MODIFY `doctorId` INT NULL;");
//     console.log("Coluna alterada com sucesso!");
//   } catch (error) {
//     console.error("Erro ao alterar a tabela:", error);
//   }
// }

// alterTable();



// Sincronizando e ajustando o banco de dados
db.sequelize.sync({ alter: true }).then(async () => {
  console.log('Banco de dados sincronizado com sucesso!');
  
  // // Garantir que a coluna doctorId permita NULL
  // await db.sequelize.query('ALTER TABLE `Appointments` MODIFY `doctorId` INTEGER NULL;');
  
  // // Adicionar a chave estrangeira corretamente
  // await db.sequelize.query('ALTER TABLE `Appointments` ADD CONSTRAINT `Appointments_doctorId_fk` FOREIGN KEY (`doctorId`) REFERENCES `Doctors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;');
}).catch((err) => {
  console.error('Erro ao sincronizar o banco de dados:', err);
});

export default app;
