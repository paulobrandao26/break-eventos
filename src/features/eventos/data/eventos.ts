import type { Evento } from "../types/evento";

// ATENÇÃO: dados de EXEMPLO. Troque pelos eventos reais.
export const EVENTOS: Evento[] = [
  {
    id: 1,
    nome: "Recife Breaking Battle",
    data: "2026-11-28",
    horario: "15:00",
    cidade: "Recife",
    estado: "PE",
    local: "Local a definir",
    descricao: "Evento de exemplo. Substitua por informações reais.",
    modalidades: ["1x1 Breaking", "2x2 Crew Battle", "Kids"],
    jurados: [
      { nome: "Jurado Exemplo 1", cidade: "Recife - PE" },
      { nome: "Jurado Exemplo 2", cidade: "São Paulo - SP" },
      { nome: "Jurado Exemplo 3", cidade: "Rio de Janeiro - RJ" },
    ],
  },
  {
    id: 2,
    nome: "Pernambuco Cypher Day",
    data: "2026-12-12",
    horario: "14:00",
    cidade: "Olinda",
    estado: "PE",
    local: "Local a definir",
    descricao: "Evento de exemplo. Substitua por informações reais.",
    modalidades: ["1x1 Breaking", "Cypher Aberta"],
    jurados: [
      { nome: "Jurado Exemplo 4", cidade: "Olinda - PE" },
      { nome: "Jurado Exemplo 5", cidade: "Salvador - BA" },
    ],
  },
  {
    id: 3,
    nome: "Nordeste All Styles",
    data: "2027-01-16",
    horario: "16:00",
    cidade: "Recife",
    estado: "PE",
    local: "Local a definir",
    descricao: "Evento de exemplo. Substitua por informações reais.",
    modalidades: ["3x3 Crew Battle", "1x1 Breaking"],
    jurados: [
      { nome: "Jurado Exemplo 6", cidade: "Fortaleza - CE" },
      { nome: "Jurado Exemplo 7", cidade: "Recife - PE" },
      { nome: "Jurado Exemplo 8", cidade: "Brasília - DF" },
    ],
  },
];
