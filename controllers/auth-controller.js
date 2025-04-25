import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';

const SECRET = process.env.JWT_SECRET || 'guitarra21';

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Tenta achar um usuário no banco, tanto na tabela Clinics quanto Clients
    const clinic = await db.Clinic.findOne({ where: { email } });
    const client = await db.Client.findOne({ where: { email } });

    const user = clinic || client;
    const role = clinic ? 'clinic' : client ? 'client' : null;

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role, // 'clinic' ou 'client'
      },
      SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role,
      },
    });

  } catch (e) {
    return res.status(500).json({ error: 'Erro ao autenticar' });
  }
};
