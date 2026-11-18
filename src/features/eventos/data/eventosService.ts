import { useSyncExternalStore } from "react";
import type { Chave, DadosEvento, Evento, EventoCadastro, Vaga } from "../types/evento";
import { EVENTOS } from "./eventos";
import { criarChave } from "./modalidades";

/*
 * Camada de dados dos eventos.
 *
 * PROTÓTIPO: os eventos cadastrados ficam salvos no navegador (localStorage),
 * então só aparecem neste aparelho. Para valer para todo mundo é preciso um
 * backend (banco de dados e login). Quando ele existir, só ESTE arquivo (e o
 * identidade.ts) precisam mudar: as telas continuam chamando as mesmas funções.
 * Regra já valendo: só quem criou o evento (donoId) consegue editá-lo.
 */

const CHAVE_EVENTOS = "break:eventos";
const CHAVE_VAGAS = "break:vagas";

/** vagas[idDoEvento][modalidade] = lista de vagas preenchidas */
type MapaVagas = Record<string, Record<string, Vaga[]>>;

function ler<T>(chave: string, padrao: T): T {
  try {
    const texto = localStorage.getItem(chave);
    return texto ? (JSON.parse(texto) as T) : padrao;
  } catch {
    return padrao;
  }
}

function gravar(chave: string, valor: unknown): boolean {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

let criados: EventoCadastro[] = ler<EventoCadastro[]>(CHAVE_EVENTOS, []);
let vagasSalvas: MapaVagas = ler<MapaVagas>(CHAVE_VAGAS, {});
let cache: Evento[] = [];
const ouvintes = new Set<() => void>();

function normalizar(e: EventoCadastro): Evento {
  const base: Chave[] =
    e.chaves ?? e.modalidades.map((m) => criarChave(m)).filter((c): c is Chave => c !== null);
  const chaves = base.map((c) => ({ ...c, vagas: vagasSalvas[e.id]?.[c.modalidade] ?? c.vagas }));
  return { ...e, organizadores: e.organizadores ?? [], chaves };
}

function recalcular(avisar = true) {
  cache = [...EVENTOS, ...criados].map(normalizar);
  if (avisar) ouvintes.forEach((f) => f());
}
recalcular(false);

// Mudanças feitas em outra aba aparecem aqui também
window.addEventListener("storage", (e) => {
  if (e.key === CHAVE_EVENTOS || e.key === CHAVE_VAGAS) {
    criados = ler<EventoCadastro[]>(CHAVE_EVENTOS, []);
    vagasSalvas = ler<MapaVagas>(CHAVE_VAGAS, {});
    recalcular();
  }
});

function assinar(f: () => void) {
  ouvintes.add(f);
  return () => ouvintes.delete(f);
}

/* ---------- Leitura ---------- */

export function useEventos(): Evento[] {
  return useSyncExternalStore(assinar, () => cache);
}

export function useEvento(id: number): Evento | undefined {
  return useEventos().find((e) => e.id === id);
}

/* ---------- Escrita ---------- */

export type Resultado<T> = { ok: true; valor: T } | { ok: false; erro: string };

const ERRO_ARMAZENAMENTO =
  "Não foi possível salvar: o armazenamento do navegador está cheio. Tente uma foto menor.";

function limpo(texto?: string): string | undefined {
  const t = texto?.trim();
  return t ? t : undefined;
}

function montarEvento(id: number, d: DadosEvento, donoId: string, antigo?: EventoCadastro): EventoCadastro {
  const chaves: Chave[] = d.modalidades
    .map((m) => {
      const existente = antigo?.chaves?.find((c) => c.modalidade.toLowerCase() === m.nome.trim().toLowerCase());
      const nova = criarChave(m.nome, m.vagas);
      // mantém a chave se o número de vagas não mudou
      return existente && nova && existente.vagas.length === nova.vagas.length ? existente : nova;
    })
    .filter((c): c is Chave => c !== null);

  return {
    id,
    donoId,
    nome: d.nome.trim(),
    data: d.data,
    horario: limpo(d.horario),
    local: limpo(d.local),
    endereco: limpo(d.endereco),
    cidade: d.cidade.trim(),
    estado: d.estado.trim().toUpperCase(),
    descricao: d.descricao.trim(),
    modalidades: d.modalidades.map((m) => m.nome.trim()),
    jurados: d.jurados.map((nome) => ({ nome })),
    dj: limpo(d.dj),
    organizadores: d.organizadores,
    premiacao: limpo(d.premiacao),
    foto: d.foto || undefined,
    linkDrive: limpo(d.linkDrive),
    chaves,
  };
}

export function criarEvento(dados: DadosEvento, donoId: string): Resultado<Evento> {
  const id = Date.now();
  const novo = montarEvento(id, dados, donoId);
  const anterior = criados;
  criados = [...criados, novo];
  if (!gravar(CHAVE_EVENTOS, criados)) {
    criados = anterior;
    return { ok: false, erro: ERRO_ARMAZENAMENTO };
  }
  recalcular();
  return { ok: true, valor: cache.find((e) => e.id === id)! };
}

export function atualizarEvento(id: number, dados: DadosEvento, usuarioId: string): Resultado<Evento> {
  const atual = criados.find((e) => e.id === id);
  if (!atual) return { ok: false, erro: "Evento não encontrado." };
  if (atual.donoId !== usuarioId) return { ok: false, erro: "Só quem cadastrou o evento pode editá-lo." };

  const atualizado = montarEvento(id, dados, usuarioId, atual);
  const anterior = criados;
  criados = criados.map((e) => (e.id === id ? atualizado : e));
  if (!gravar(CHAVE_EVENTOS, criados)) {
    criados = anterior;
    return { ok: false, erro: ERRO_ARMAZENAMENTO };
  }

  // descarta vagas de modalidades removidas ou cujo número de vagas mudou
  const doEvento = vagasSalvas[id];
  if (doEvento) {
    for (const modalidade of Object.keys(doEvento)) {
      const chave = atualizado.chaves?.find((c) => c.modalidade === modalidade);
      if (!chave || chave.vagas.length !== doEvento[modalidade].length) delete doEvento[modalidade];
    }
    gravar(CHAVE_VAGAS, vagasSalvas);
  }
  recalcular();
  return { ok: true, valor: cache.find((e) => e.id === id)! };
}

function salvarVagas(eventoId: number, modalidade: string, vagas: Vaga[]): boolean {
  const anterior = vagasSalvas;
  vagasSalvas = { ...vagasSalvas, [eventoId]: { ...vagasSalvas[eventoId], [modalidade]: vagas } };
  if (!gravar(CHAVE_VAGAS, vagasSalvas)) {
    vagasSalvas = anterior;
    return false;
  }
  recalcular();
  return true;
}

/** Preenche uma vaga: nome + check-in confirmado. */
export function preencherVaga(eventoId: number, modalidade: string, indice: number, vaga: Vaga): boolean {
  const chave = cache.find((e) => e.id === eventoId)?.chaves.find((c) => c.modalidade === modalidade);
  if (!chave || indice < 0 || indice >= chave.vagas.length) return false;
  const vagas = chave.vagas.map((v, i) => (i === indice ? { nome: vaga.nome.trim(), confirmado: vaga.confirmado } : v));
  return salvarVagas(eventoId, modalidade, vagas);
}

/** Esvazia uma vaga (usado pelo organizador). */
export function liberarVaga(eventoId: number, modalidade: string, indice: number): boolean {
  return preencherVaga(eventoId, modalidade, indice, { nome: "", confirmado: false });
}
