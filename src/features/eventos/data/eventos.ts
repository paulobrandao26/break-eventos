import type { Evento } from "../types/evento";

// Para adicionar um evento: copie um bloco, use um id novo e preencha os dados.
// horario e local são opcionais; jurados: [] mostra "jurados ainda a confirmar".
export const EVENTOS: Evento[] = [
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
