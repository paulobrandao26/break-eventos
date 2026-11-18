import { Link, useParams } from "react-router-dom";
import { buscarEvento } from "../data/eventosService";
import { ListaJurados } from "../components/ListaJurados";
import { ListaModalidades } from "../components/ListaModalidades";
import { tintaDoEvento } from "../components/tinta";
import { MESES_ABREV } from "@/shared/utils/datas";
import { linhaOnde } from "../utils/onde";

export function EventoPage() {
  const { id } = useParams();
  const evento = buscarEvento(Number(id));

  if (!evento) {
    return (
      <>
        <Link className="voltar" to="/">Voltar para a agenda</Link>
        <p className="muro__vazio">Esse evento não existe ou foi removido.</p>
      </>
    );
  }

  const mes = Number(evento.data.slice(5, 7)) - 1;

  return (
    <article className="evento">
      <Link className="voltar" to="/">Voltar para a agenda</Link>

      <header className={`evento__cartaz cartaz--${tintaDoEvento(evento.id)}`}>
        <span className="proximo__fita" aria-hidden="true" />
        <span className="proximo__data">
          <strong>{evento.data.slice(8, 10)}</strong>
          <span>{MESES_ABREV[mes]}</span>
        </span>
        <div className="evento__texto">
          <h1 className="evento__titulo">{evento.nome}</h1>
          <p className="evento__onde">{linhaOnde(evento)}</p>
          <p className="evento__desc">{evento.descricao}</p>
        </div>
      </header>

      <section className="secao" aria-labelledby="modalidades">
        <h2 id="modalidades" className="fita">Modalidades</h2>
        <ListaModalidades modalidades={evento.modalidades} />
      </section>

      <section className="secao" aria-labelledby="jurados">
        <h2 id="jurados" className="fita">Jurados</h2>
        {evento.jurados.length > 0 ? (
          <ListaJurados jurados={evento.jurados} />
        ) : (
          <p className="muro__vazio">Os jurados ainda serão confirmados.</p>
        )}
      </section>
    </article>
  );
}
