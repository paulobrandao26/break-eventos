import type { Chave } from "../types/evento";

export interface ModalidadePadrao {
  nome: string;
  vagas: number;
  ajuda: string;
  rotulo: (indice: number) => string;
}

/** Modalidades prontas: cada uma já sabe quantas vagas tem. */
export const MODALIDADES_PADRAO: ModalidadePadrao[] = [
  {
    nome: "1 vs 1",
    vagas: 16,
    ajuda: "16 vagas, uma para cada participante.",
    rotulo: (i) => `Vaga ${i + 1}`,
  },
  {
    nome: "7 Smoke",
    vagas: 8,
    ajuda: "7 b-boys contra 1, o Smoke: 8 vagas no total.",
    rotulo: (i) => (i < 7 ? `B-boy ${i + 1}` : "Smoke"),
  },
];

export const VAGAS_MIN = 2;
export const VAGAS_MAX = 64;

export function modalidadePadrao(nome: string): ModalidadePadrao | undefined {
  return MODALIDADES_PADRAO.find((m) => m.nome.toLowerCase() === nome.trim().toLowerCase());
}

/** Cria a chave (todas as vagas vazias). Sem vagas definidas, a modalidade não tem chave. */
export function criarChave(nome: string, vagasPersonalizadas?: number): Chave | null {
  const padrao = modalidadePadrao(nome);
  const total = padrao?.vagas ?? vagasPersonalizadas ?? 0;
  if (!total) return null;

  return {
    modalidade: padrao?.nome ?? nome.trim(),
    rotulos: Array.from({ length: total }, (_, i) => (padrao ? padrao.rotulo(i) : `Vaga ${i + 1}`)),
    vagas: Array.from({ length: total }, () => ({ nome: "", confirmado: false })),
  };
}
