import { Link } from "react-router-dom";
import type { Evento } from "../types/evento";
import { MESES_ABREV, diasAte, textoContagem } from "@/shared/utils/datas";
import { tintaDoEvento } from "./tinta";
import { linhaOnde } from "../utils/onde";

/** O próximo evento, colado grande no muro, logo na abertura da página. */
export function ProximoEvento({ evento }: { evento: Evento }) {
  const mes = Number(evento.data.slice(5, 7)) - 1;
  const dias = diasAte(evento.data);

  return (
    <Link
      to={`/eventos/${evento.id}`}
      className={`proximo cartaz--${tintaDoEvento(evento.id)}`}
      aria-label={`Próximo evento: ${evento.nome}. Ver jurados e modalidades.`}
    >
      <span className="proximo__fita" aria-hidden="true" />
      <span className="proximo__data">
        <strong>{evento.data.slice(8, 10)}</strong>
        <span>{MESES_ABREV[mes]}</span>
      </span>
      <span className="proximo__corpo">
        <span className="proximo__nome">{evento.nome}</span>
        <span className="proximo__onde">{linhaOnde(evento)}</span>
        <span className="proximo__modalidades">
          {evento.modalidades.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </span>
        <span className="proximo__acao">Ver jurados e modalidades</span>
      </span>
      {dias >= 0 && <span className="proximo__selo">{textoContagem(dias)}</span>}
    </Link>
  );
}
