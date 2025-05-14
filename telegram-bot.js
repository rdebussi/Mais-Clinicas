import TelegramBot from 'node-telegram-bot-api';
import fetch from 'node-fetch';
import db from './models/index.js';

const bot = new TelegramBot('7916606686:AAGOMGWar5aJgbE_LD9fIYfvPuew-d9ZhQU', { polling: true });
const CLINIC_ID = 1;
const CLIENT_ID = 1; // futuramente você pode fazer o mapeamento chatId -> clientId

const userSession = {}; // Armazena temporariamente as escolhas do usuário

function exibirMenuInicial(chatId, nome) {
  bot.sendMessage(chatId,  `🙋 Olá ${nome || ''}, somos a Clínica Health Care \n\n escolha uma opção abaixo:`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🩺 Agendar consulta', callback_data: 'ver_medicos' }],
        [{ text: '📅 Meus agendamentos', callback_data: 'meus_agendamentos' }]
      ]
    }
  });
}

const pendingCpf = {};

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const nome = msg.from.first_name;

  try {
    const response = await fetch(`http://localhost:3001/client?chatId=${chatId}`);
    const client = await response.json(); // <- aqui estava faltando o await
    console.log(client)
    
    //ERRO AQUI
    if (client && client.id) {
      return exibirMenuInicial(chatId, nome); // cliente já vinculado
    } else {
      pendingCpf[chatId] = true;
      return bot.sendMessage(chatId, 'Para continuar, informe seu CPF (apenas números)');
    }
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, 'Erro ao buscar o cliente. Tente novamente.');
  }
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Só trata CPF se ele estiver na fase de cadastro
  if (pendingCpf[chatId]) {
    const cpf = text.replace(/\D/g, ''); // remove não-numéricos

    if (cpf.length !== 12) {
      return bot.sendMessage(chatId, 'CPF inválido. Envie apenas os 11 números.');
    }

    try {
      const response = await fetch(`http://localhost:3001/client?cpf=${cpf}`);
      const client = await response.json();

      if (!client || !client.id) {
        return bot.sendMessage(chatId, 'CPF não encontrado no sistema.');
      }

      // Atualiza o chatId no banco
      await fetch(`http://localhost:3001/client/${client.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId })
      });

      delete pendingCpf[chatId];
      bot.sendMessage(chatId, '✅ Cadastro confirmado com sucesso!');
      exibirMenuInicial(chatId, msg.from.first_name);

    } catch (err) {
      console.error(err);
      bot.sendMessage(chatId, 'Erro ao validar o CPF. Tente novamente.');
    }
  }
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
        reply_markup: {
          inline_keyboard : [
              ...keyboard,
              [ {text: '🔙 Voltar', callback_data: 'menu_inicial'} ]
          ]
        }
      }
      );

    } catch (err) {
      console.error(err);
      bot.sendMessage(chatId, 'Erro ao buscar médicos.');
    }
  }

  // ESCOLHEU MÉDICO
  else if (data.startsWith('medico_')) {
    const doctorId = parseInt(data.split('_')[1], 10);
    userSession[chatId] = {
      ...userSession[chatId],
      doctorId
    };
    
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
        reply_markup: {
          inline_keyboard: [
            ...slotsKeyboard,
            [ {text: '🔙 Voltar', callback_data: 'menu_inicial'} ]
          ]
        }
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
