import type { Evento } from "../types/evento";

/** Monta a linha "Local, Cidade - UF, às HH:MM" usando só o que já foi informado. */
export function linhaOnde(evento: Evento, comLocal = true): string {
  const lugar = [comLocal && evento.local, `${evento.cidade} - ${evento.estado}`]
    .filter(Boolean)
    .join(", ");
  return evento.horario ? `${lugar}, às ${evento.horario}` : lugar;
}
