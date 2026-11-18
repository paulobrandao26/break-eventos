export interface Jurado {
  nome: string;
  /** Opcional: nem sempre é informado. */
  cidade?: string;
}

/** Uma vaga da chave: um bloco onde o participante escreve o nome e confirma o check-in. */
export interface Vaga {
  nome: string;
  /** Check-in: "confirmado, eu vou". */
  confirmado: boolean;
}

/** A chave de uma modalidade (ex.: 1 vs 1 tem 16 vagas; 7 Smoke tem 8). */
export interface Chave {
  modalidade: string;
  /** Texto de cada bloco, na ordem (ex.: "B-boy 1", ..., "Smoke"). */
  rotulos: string[];
  vagas: Vaga[];
}

interface EventoBase {
  id: number;
  nome: string;
  /** Formato AAAA-MM-DD */
  data: string;
  /** Opcional: some da tela quando ainda não foi confirmado. */
  horario?: string;
  cidade: string;
  estado: string;
  /** Opcional: nome do espaço, quando já estiver definido. */
  local?: string;
  /** Opcional: rua, número e bairro. */
  endereco?: string;
  descricao: string;
  /** Nomes das modalidades. */
  modalidades: string[];
  /** Lista vazia = jurados ainda a confirmar. */
  jurados: Jurado[];
  dj?: string;
  premiacao?: string;
  /** Uma foto do evento (imagem em base64, já reduzida). */
  foto?: string;
  /** Link da pasta do Google Drive com as fotos do evento. */
  linkDrive?: string;
}

/** Como o evento é escrito nos dados e salvo (campos novos são opcionais). */
export interface EventoCadastro extends EventoBase {
  organizadores?: string[];
  chaves?: Chave[];
  /** Id do organizador que criou. Eventos fixos não têm dono. */
  donoId?: string;
}

/** Como o evento chega às telas (sempre completo). */
export interface Evento extends EventoBase {
  organizadores: string[];
  chaves: Chave[];
  donoId?: string;
}

/** O que o formulário de cadastro envia. */
export interface DadosEvento {
  nome: string;
  data: string;
  horario?: string;
  local?: string;
  endereco?: string;
  cidade: string;
  estado: string;
  descricao: string;
  /** vagas só é usado em modalidades fora da lista padrão. */
  modalidades: { nome: string; vagas?: number }[];
  jurados: string[];
  dj?: string;
  organizadores: string[];
  premiacao?: string;
  foto?: string;
  linkDrive?: string;
}
