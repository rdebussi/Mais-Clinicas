import TelegramBot from 'node-telegram-bot-api';
import fetch from 'node-fetch';
import db from './models/index.js';

const bot = new TelegramBot('7916606686:AAGOMGWar5aJgbE_LD9fIYfvPuew-d9ZhQU', { polling: true });
const CLINIC_ID = 1;
const CLIENT_ID = 1; // futuramente você pode fazer o mapeamento chatId -> clientId

const userSession = {}; // Armazena temporariamente as escolhas do usuário

function exibirMenuInicial(chatId, nome) {
  bot.sendMessage(chatId, `Olá ${nome || ''}, escolha uma opção abaixo:`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🩺 Ver médicos', callback_data: 'ver_medicos' }],
        [{ text: '📅 Meus agendamentos', callback_data: 'meus_agendamentos' }]
      ]
    }
  });
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const nome = msg.from.first_name;
  exibirMenuInicial(chatId, nome);
});

bot.on('callback_query', async (callbackQuery) => {
  const msg = callbackQuery.message;
  const chatId = msg.chat.id;
  const data = callbackQuery.data;

  // MENU PRINCIPAL
  if (data === 'menu_inicial') {
    return exibirMenuInicial(chatId);
  }

  // VER MÉDICOS
  else if (data === 'ver_medicos') {
    try {
      const doctors = await db.Doctor.findAll({ where: { clinicId: CLINIC_ID } });

      if (doctors.length === 0) {
        return bot.sendMessage(chatId, 'Nenhum médico cadastrado.');
      }

      const keyboard = doctors.map(doc => [{
        text: `🩺 ${doc.name} (${doc.specialty})`,
        callback_data: `medico_${doc.id}`
      }]);

      bot.sendMessage(chatId, 'Escolha um médico:', {
        reply_markup: { inline_keyboard: keyboard }
      });

    } catch (err) {
      console.error(err);
      bot.sendMessage(chatId, 'Erro ao buscar médicos.');
    }
  }

  // ESCOLHEU MÉDICO
  else if (data.startsWith('medico_')) {
    const doctorId = parseInt(data.split('_')[1], 10);
    userSession[chatId] = { doctorId };

    const date = new Date();
    date.setDate(date.getDate() + 1); // amanhã
    const isoDate = date.toISOString().split('T')[0];

    try {
      const response = await fetch(`http://localhost:3001/doctor/${doctorId}/available?date=${isoDate}`);
      const result = await response.json();

      if (!result.availableSlots || result.availableSlots.length === 0) {
        return bot.sendMessage(chatId, 'Nenhum horário disponível para esse médico amanhã.');
      }

      const slotsKeyboard = result.availableSlots.map(slot => [{
        text: slot,
        callback_data: `confirmar_${doctorId}_${isoDate}_${slot}`
      }]);

      bot.sendMessage(chatId, `Horários disponíveis para ${isoDate}:`, {
        reply_markup: { inline_keyboard: slotsKeyboard }
      });

    } catch (err) {
      console.error(err);
      bot.sendMessage(chatId, 'Erro ao buscar horários disponíveis.');
    }
  }

  // CONFIRMAR HORÁRIO
  else if (data.startsWith('confirmar_')) {
    const [_, doctorId, date, time] = data.split('_');
    const doctor = await db.Doctor.findByPk(doctorId);

    userSession[chatId] = {
      ...userSession[chatId],
      date,
      time
    };

    bot.sendMessage(chatId,
      `Deseja marcar uma consulta com o médico *${doctor.name}* no dia *${date}*, às *${time}*?`, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '✅ Confirmar', callback_data: 'finalizar_agendamento' },
              { text: '🔙 Voltar', callback_data: 'ver_medicos' }
            ]
          ]
        }
      });
  }

  // FINALIZAR AGENDAMENTO
  else if (data === 'finalizar_agendamento') {
    const session = userSession[chatId];
    if (!session?.doctorId || !session?.date || !session?.time) {
      return bot.sendMessage(chatId, 'Informações incompletas para o agendamento.');
    }

    const isoDateTime = new Date(`${session.date}T${session.time}:00`).toISOString();

    try {
      const body = {
        schedule: isoDateTime,
        status: 'agendada',
        doctorId: session.doctorId,
        clientId: CLIENT_ID,
        clinicId: CLINIC_ID
      };
      const response = await fetch('http://localhost:3001/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error('Erro na criação do agendamento');
      }

      bot.sendMessage(chatId, '✅ Consulta marcada com sucesso!');
      delete userSession[chatId];

    } catch (err) {
      console.error(err);
      bot.sendMessage(chatId, '❌ Erro ao marcar a consulta. Tente novamente mais tarde.');
    }
  }

  // MEUS AGENDAMENTOS
  else if (data === 'meus_agendamentos') {
    try {
      const response = await fetch(`http://localhost:3001/appointment?clientId=${CLIENT_ID}`);
      const appointments = await response.json();

      if (!appointments.length) {
        return bot.sendMessage(chatId, '📭 Você não possui agendamentos.');
      }

      const lista = appointments.map(ap => {
        const date = new Date(ap.schedule);
        const dataFormatada = date.toLocaleDateString('pt-BR');
        const horaFormatada = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        return `🗓️ ${dataFormatada} às ${horaFormatada} - *${ap.doctor.name}* (${ap.doctor.specialty})`;
      }).join('\n\n');

      bot.sendMessage(chatId, `Seus agendamentos:\n\n${lista}`, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔙 Voltar', callback_data: 'menu_inicial' }]
          ]
        }
      });

    } catch (err) {
      console.error(err);
      bot.sendMessage(chatId, '❌ Erro ao buscar seus agendamentos.');
    }
  }

  bot.answerCallbackQuery(callbackQuery.id);
});

// /medicos comando alternativo (não mexido)
bot.onText(/\/medicos/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const doctors = await db.Doctor.findAll({
      where: { clinicId: CLINIC_ID },
      attributes: ['id', 'name', 'specialty']
    });

    if (doctors.length === 0) {
      return bot.sendMessage(chatId, 'Nenhum médico cadastrado para esta clínica.');
    }

    const lista = doctors.map(d => `🩺 ${d.name} (${d.specialty})`).join('\n');
    bot.sendMessage(chatId, `Médicos da clínica:\n\n${lista}`);
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, 'Erro ao buscar os médicos.');
  }
});
