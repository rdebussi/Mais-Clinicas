import { Router } from 'express';

const routes = Router();

routes.get('/', (req, res) => {
  res.json({ msg: 'API da Secretária Moderna funcionando!' });
});

export default routes;
