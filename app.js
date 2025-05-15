import express from 'express';
import routes from './routes/index.js';
import db from './models/index.js';

const app = express();
app.use(express.json());
app.use(routes);

// Sincronizando e ajustando o banco de dados
db.sequelize.sync().then(async () => {
  console.log('Banco de dados sincronizado com sucesso!');
}).catch((err) => {
  console.error('Erro ao sincronizar o banco de dados:', err);
});

export default app;
