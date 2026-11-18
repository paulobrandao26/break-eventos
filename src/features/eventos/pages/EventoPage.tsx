import { Link, useParams } from "react-router-dom";
import { buscarEvento } from "../data/eventosService";
import { ListaJurados } from "../components/ListaJurados";
import { ListaModalidades } from "../components/ListaModalidades";
import { formatarData } from "@/shared/utils/datas";

export function EventoPage() {
  const { id } = useParams();
  const evento = buscarEvento(Number(id));

  if (!evento) {
    return (
      <>
        <Link className="voltar" to="/">&larr; Voltar ao calendário</Link>
        <p>Evento não encontrado.</p>
      </>
    );
  }

  return (
    <>
      <Link className="voltar" to="/">&larr; Voltar ao calendário</Link>
      <h1 className="evento-titulo">{evento.nome}</h1>
      <p className="evento-info">
        {formatarData(evento.data)} às {evento.horario} · {evento.local} · {evento.cidade} - {evento.estado}
      </p>
      <p className="evento-desc">{evento.descricao}</p>

      <section className="secao">
        <h3>Modalidades</h3>
        <ListaModalidades modalidades={evento.modalidades} />
      </section>

      <section className="secao">
        <h3>Jurados</h3>
        <ListaJurados jurados={evento.jurados} />
      </section>
    </>
  );
}
