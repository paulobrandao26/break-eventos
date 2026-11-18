import { Link } from "react-router-dom";
import type { Evento } from "../types/evento";
import { DIAS_SEMANA } from "@/shared/utils/datas";
import { tintaDoEvento } from "./tinta";

interface Props {
  ano: number;
  mes: number; // 0-11
  eventos: Evento[]; // já filtrados para o mês
}

export function Calendario({ ano, mes, eventos }: Props) {
  const porDia = new Map<number, Evento>();
  eventos.forEach((e) => {
    const dia = Number(e.data.slice(8, 10));
    if (!porDia.has(dia)) porDia.set(dia, e);
  });

  const primeiro = new Date(ano, mes, 1).getDay();
  const totalDias = new Date(ano, mes + 1, 0).getDate();

  return (
    <div className="folha">
      <div className="folha__grade">
        {DIAS_SEMANA.map((d) => (
          <div key={d} className="folha__semana">{d}</div>
        ))}
        {Array.from({ length: primeiro }, (_, i) => (
          <div key={`v${i}`} className="folha__dia folha__dia--vazio" />
        ))}
        {Array.from({ length: totalDias }, (_, i) => {
          const dia = i + 1;
          const ev = porDia.get(dia);
          return ev ? (
            <Link
              key={dia}
              to={`/eventos/${ev.id}`}
              className={`folha__dia folha__dia--evento cartaz--${tintaDoEvento(ev.id)}`}
              aria-label={`Dia ${dia}: ${ev.nome}`}
              title={ev.nome}
            >
              <span className="folha__numero">{dia}</span>
              <span className="folha__nome">{ev.nome}</span>
            </Link>
          ) : (
            <div key={dia} className="folha__dia">
              <span className="folha__numero">{dia}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
