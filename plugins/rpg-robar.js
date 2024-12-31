let cooldowns = {};

let handler = async (m, { conn, isPrems }) => {
  const tiempoEspera = 2 * 60 * 60;
  const users = Object.keys(global.db.data.users); 
  const usuarioObjetivo = pickRandom(users.filter((u) => u !== m.sender)); 

  if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempoEspera * 1000) {
    const tiempoRestante = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempoEspera * 1000 - Date.now()) / 1000));
    conn.reply(m.chat, `🚩 Espera ⏱ *${tiempoRestante}* para volver a robar corazones.`, m);
    return;
  }

  let user = global.db.data.users[m.sender];
  let targetUser = global.db.data.users[usuarioObjetivo];

  // Asegurarse de que ambos usuarios tengan corazones inicializados
  user.corazones = user.corazones || 0;
  targetUser.corazones = targetUser.corazones || 0;

  const corazonesRobados = Math.floor(Math.random() * 5) + 1;

  if (targetUser.corazones < corazonesRobados) {
    conn.reply(m.chat, `🤍 ${pickRandom(failMessages)} *${targetUser.name || usuarioObjetivo}* no tiene suficientes corazones para robar.`, m,rcanal);
    return;
  }

  // Transferencia de corazones
  targetUser.corazones -= corazonesRobados;
  user.corazones += corazonesRobados;

  cooldowns[m.sender] = Date.now(); // Registrar tiempo de uso

  conn.reply(
    m.chat,
    `🤍 *¡Has robado ${corazonesRobados} corazones de ${targetUser.name || `@${usuarioObjetivo.split('@')[0]}`}!* Ahora tienes *${user.corazones} corazones*.`,
    m,rcanal
    { mentions: [usuarioObjetivo] }
  );
};

handler.help = ['steal'];
handler.tags = ['rpg'];
handler.command = ['steal', 'robar'];
handler.register = true;

export default handler;

function segundosAHMS(segundos) {
  let horas = Math.floor(segundos / 3600);
  let minutos = Math.floor((segundos % 3600) / 60);
  let segundosRestantes = segundos % 60;
  return `${horas} horas, ${minutos} minutos y ${segundosRestantes} segundos`;
}

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())];
}

// Mensajes de error cuando no se puede robar corazones
const failMessages = [
  "Intentaste robar corazones, pero fallaste.",
  "El objetivo protegió sus corazones.",
  "¡No pudiste robar corazones esta vez!",
];
