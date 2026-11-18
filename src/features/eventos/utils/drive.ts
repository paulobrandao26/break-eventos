const HOSTS_PERMITIDOS = [
  "drive.google.com",
  "docs.google.com",
  "photos.google.com",
  "photos.app.goo.gl",
  "share.google",
];

export type LinkDrive = { ok: true; url: string } | { ok: false; erro: string };

/** Confere se o texto é um link do Google Drive/Fotos e devolve a URL limpa. */
export function validarLinkDrive(texto: string): LinkDrive {
  const bruto = texto.trim();
  if (!bruto) return { ok: false, erro: "Cole o link da pasta do Google Drive." };

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(bruto) ? bruto : `https://${bruto}`);
  } catch {
    return { ok: false, erro: "Esse texto não parece um link." };
  }

  if (url.protocol !== "https:") return { ok: false, erro: "Use um link que comece com https://." };
  if (!HOSTS_PERMITIDOS.includes(url.hostname)) {
    return { ok: false, erro: "Use um link do Google Drive (drive.google.com) ou do Google Fotos." };
  }
  return { ok: true, url: url.toString() };
}

/** Mostra só o endereço curto do link, para caber na tela. */
export function resumirLink(url: string): string {
  try {
    const u = new URL(url);
    const caminho = u.pathname.length > 24 ? `${u.pathname.slice(0, 24)}…` : u.pathname;
    return `${u.hostname}${caminho}`;
  } catch {
    return url;
  }
}
