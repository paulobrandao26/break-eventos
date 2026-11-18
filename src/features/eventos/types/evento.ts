export interface Jurado {
  nome: string;
  cidade: string;
}

export interface Evento {
  id: number;
  nome: string;
  /** Formato AAAA-MM-DD */
  data: string;
  horario: string;
  cidade: string;
  estado: string;
  local: string;
  descricao: string;
  modalidades: string[];
  jurados: Jurado[];
}
