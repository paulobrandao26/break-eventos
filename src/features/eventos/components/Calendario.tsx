import { Link } from "react-router-dom";
import type { Evento } from "../types/evento";

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
    <div className="calendario">
      {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
        <div key={i} className="dia-semana">{d}</div>
      ))}
      {Array.from({ length: primeiro }, (_, i) => (
        <div key={`v${i}`} className="dia vazio" />
      ))}
      {Array.from({ length: totalDias }, (_, i) => {
        const dia = i + 1;
        const ev = porDia.get(dia);
        return ev ? (
          <Link key={dia} className="dia com-evento" to={`/eventos/${ev.id}`} title={ev.nome}>
            {dia}
            <span className="ponto">{ev.nome}</span>
          </Link>
        ) : (
          <div key={dia} className="dia">{dia}</div>
        );
      })}
    </div>
  );
}
