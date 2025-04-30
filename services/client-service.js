// ✅ services/client-service.js
import db from '../models/index.js';
import bcrypt from 'bcrypt'

export const createClient = async (data) => {
  const { email } = data;
  const existing = await db.Client.findOne({ where: { email } });
  if (existing) throw new Error('Email já cadastrado');
  const client = await db.Client.create(data);
  return client;
};

export const getClientById = async (id) => {
  const client = await db.Client.findByPk(id, {
    attributes: { exclude: ['password'] },
    include: [
      {
        model: db.Appointment,
        as: 'appointments',
        include: [
          {
            model: db.Doctor,
            as: 'doctor',
            attributes: ['name', 'specialty']
          }
        ]
      }
    ]
  });
  if (!client) throw new Error('Cliente não encontrado');
  return client;
};

export const updateClient = async (id, data) => {
  try {
    const existingClient = await db.Client.findByPk(id);
    if (!existingClient) throw new Error('Cliente não encontrado');

    const isPasswordCorrect = await bcrypt.compare(
      data.password,
      existingClient.password
    );
    if (!isPasswordCorrect) {
      throw new Error('Senha incorreta');
    }
    const updateData = { ...data };
    delete updateData.password;
    const [affected] = await db.Client.update(updateData, { where: { id } });
    if (affected === 0) throw new Error('Nada foi atualizado');
    return await getClientById(id);
  } catch (e) {
    throw e;
  }
};


export const deleteClient = async (id) => {
  const client = await db.Client.findByPk(id);
  if (!client) throw new Error('Cliente não encontrado');
  await db.Client.destroy({ where: { id } });
  return true;
};

export const changeClientPassword = async (id, oldPassword, newPassword) => {
  try {
    const client = await db.Client.findByPk(id);
    if (!client) {
      throw new Error('Cliente não encontrado');
    }

    const isPasswordCorrect = await bcrypt.compare(oldPassword, client.password);
    if (!isPasswordCorrect) {
      throw new Error('Senha atual incorreta');
    }

    client.password = newPassword; // Será hasheada pelo hook beforeUpdate
    await client.save();
    return true;
  } catch(e) {
    throw e;
  }
};