export interface Jurado {
  nome: string;
  /** Opcional: nem sempre é informado. */
  cidade?: string;
}

export interface Evento {
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
  descricao: string;
  modalidades: string[];
  /** Lista vazia = jurados ainda a confirmar. */
  jurados: Jurado[];
}
