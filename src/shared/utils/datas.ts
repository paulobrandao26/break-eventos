/** Converte "AAAA-MM-DD" em "DD/MM/AAAA". */
export function formatarData(iso: string): string {
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}

export const MESES_ABREV = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

export const DIAS_SEMANA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

/** Dias entre hoje e a data do evento (0 = hoje, negativo = já passou). */
export function diasAte(iso: string, hoje = new Date()): number {
  const [a, m, d] = iso.split("-").map(Number);
  const alvo = new Date(a, m - 1, d);
  const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  return Math.round((alvo.getTime() - inicioHoje.getTime()) / 86_400_000);
}

export function textoContagem(dias: number): string {
  if (dias === 0) return "é hoje";
  if (dias === 1) return "é amanhã";
  return `faltam ${dias} dias`;
}
