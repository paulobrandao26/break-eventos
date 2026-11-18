/*
 * Quem criou o evento.
 *
 * PROTÓTIPO, sem login: cada navegador recebe um código aleatório, guardado no
 * aparelho, e o evento criado fica marcado com esse código. Só quem tem o mesmo
 * código (o mesmo navegador) consegue editar o evento. Quando existir login de
 * verdade, é só devolver aqui o id do usuário logado; o resto do site não muda.
 */

const CHAVE = "break:dispositivo";

export function idDoOrganizador(): string {
  try {
    const existente = localStorage.getItem(CHAVE);
    if (existente) return existente;
    const novo = crypto.randomUUID();
    localStorage.setItem(CHAVE, novo);
    return novo;
  } catch {
    // sem armazenamento disponível: vale só enquanto a página estiver aberta
    return "sem-armazenamento";
  }
}
