import { Link } from "react-router-dom";
import type { Evento } from "../types/evento";
import { MESES_ABREV } from "@/shared/utils/datas";
import { inclinacaoDoEvento, tintaDoEvento } from "./tinta";
import { linhaOnde } from "../utils/onde";

/** Um evento como cartaz colado no muro. */
export function CardEvento({ evento, indice = 0 }: { evento: Evento; indice?: number }) {
  const mes = Number(evento.data.slice(5, 7)) - 1;
  return (
    <Link
      className={`cartaz cartaz--${tintaDoEvento(evento.id)}`}
      to={`/eventos/${evento.id}`}
      style={
        {
          "--giro": `${inclinacaoDoEvento(evento.id)}deg`,
          "--ordem": indice,
        } as React.CSSProperties
      }
    >
      <span className="cartaz__data">
        <strong>{evento.data.slice(8, 10)}</strong>
        <span>{MESES_ABREV[mes]}</span>
      </span>
      <span className="cartaz__nome">{evento.nome}</span>
      <span className="cartaz__onde">{linhaOnde(evento, false)}</span>
    </Link>
  );
}
