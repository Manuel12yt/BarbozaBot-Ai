// Darcore profecional codigo
import fetch from 'node-fetch';

let handler  = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, '❀ Ingresa un link de youtube', m,rcanal);

  try {
    let api = await fetch(`https://restapi.apibotwa.biz.id/api/ytmp4?url=${text}`);
    let json = await api.json();
    let title = json.data.metadata.title;
    let dl_url = json.data.download.url;
    await conn.sendMessage(m.chat, { 
      video: { url: dl_url }, 
      fileName: `${json.data.filename}.mp4`, 
      mimetype: 'video/mp4' 
    }, { quoted: m });

  } catch (error) {
    console.error(error);
    conn.reply(m.chat, '🚩 Ocurrió un error al procesar la solicitud. Intenta nuevamente más tarde.', m,rcanal);
  }
}

handler.help = ["ytmp4 *<url>*"];
handler.tags = ['dl'];
handler.command = ['ytmp4'];
handler.register = true;

export default handler;
