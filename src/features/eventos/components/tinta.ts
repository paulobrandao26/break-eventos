// Cada evento ganha uma tinta de serigrafia e uma inclinação fixas (pelo id),
// para o muro parecer colado à mão, mas sem mudar a cada renderização.
const TINTAS = ["azul", "rosa", "amarelo"] as const;
export type Tinta = (typeof TINTAS)[number];

export function tintaDoEvento(id: number): Tinta {
  return TINTAS[id % TINTAS.length];
}

const INCLINACOES = [-2.2, 1.6, -1, 2.4, -1.7, 0.9];

export function inclinacaoDoEvento(id: number): number {
  return INCLINACOES[id % INCLINACOES.length];
}
