import app from './app.js';
import clinicRoutes from './routes/clinic-routes.js';
import loginRoutes from './routes/auth-routes.js'

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} 🚀`);
});

app.use('/clinics', clinicRoutes);
app.use('/login', loginRoutes)
