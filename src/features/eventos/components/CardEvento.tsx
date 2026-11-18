import { Link } from "react-router-dom";
import type { Evento } from "../types/evento";
import { MESES_ABREV } from "@/shared/utils/datas";

export function CardEvento({ evento }: { evento: Evento }) {
  const mes = Number(evento.data.slice(5, 7)) - 1;
  return (
    <Link className="card-evento" to={`/eventos/${evento.id}`}>
      <div className="data-badge">
        <small>{MESES_ABREV[mes]}</small>
        <strong>{evento.data.slice(8, 10)}</strong>
      </div>
      <div>
        <h4>{evento.nome}</h4>
        <p>
          {evento.cidade} - {evento.estado} · {evento.horario}
        </p>
      </div>
    </Link>
  );
}
