import type { EventoCadastro } from "../types/evento";

// Eventos fixos (escritos no código). Os eventos cadastrados pelos organizadores
// ficam em eventosService.ts. Os campos novos (dj, premiacao, organizadores...) são opcionais.
// As chaves de vagas (1 vs 1, 7 Smoke) são criadas sozinhas a partir das modalidades.
export const EVENTOS: EventoCadastro[] = [
  {
    id: 4,
    nome: "Street Cut",
    data: "2026-12-06",
    cidade: "São Lourenço da Mata",
    estado: "PE",
    descricao: "Evento de breaking em São Lourenço da Mata, Pernambuco.",
    modalidades: ["7 Smoke"],
    jurados: [{ nome: "JJ" }, { nome: "Ruschel" }, { nome: "Tartaruga" }],
  },
  {
    id: 5,
    nome: "Break do Verão",
    data: "2027-01-23",
    cidade: "Recife",
    estado: "PE",
    descricao: "Evento de breaking em Recife.",
    modalidades: ["1 vs 1"],
    jurados: [],
  },
];
