import type { Evento } from "../types/evento";
import { EVENTOS } from "./eventos";

// Camada de acesso a dados. Hoje lê de um arquivo local; quando houver
// API/banco, só este arquivo muda (as páginas continuam iguais).
export function listarEventos(): Evento[] {
  return EVENTOS;
}

export function buscarEvento(id: number): Evento | undefined {
  return EVENTOS.find((e) => e.id === id);
}
