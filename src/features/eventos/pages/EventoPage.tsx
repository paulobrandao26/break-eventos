import { Link, useParams } from "react-router-dom";
import { useEvento } from "../data/eventosService";
import { idDoOrganizador } from "../data/identidade";
import { ListaJurados } from "../components/ListaJurados";
import { ListaModalidades } from "../components/ListaModalidades";
import { ChaveVagas } from "../components/ChaveVagas";
import { tintaDoEvento } from "../components/tinta";
import { MESES_ABREV } from "@/shared/utils/datas";
import { linhaOnde } from "../utils/onde";

export function EventoPage() {
  const { id } = useParams();
  const evento = useEvento(Number(id));

  if (!evento) {
    return (
      <>
        <Link className="voltar" to="/">Voltar para a agenda</Link>
        <p className="muro__vazio">Esse evento não existe ou foi removido.</p>
      </>
    );
  }

  const mes = Number(evento.data.slice(5, 7)) - 1;
  // só quem criou o evento (neste navegador, por enquanto) pode editar e liberar vagas
  const ehDono = evento.donoId !== undefined && evento.donoId === idDoOrganizador();

  const detalhes: { titulo: string; valor: string }[] = [];
  if (evento.endereco) detalhes.push({ titulo: "Endereço", valor: evento.endereco });
  if (evento.premiacao) detalhes.push({ titulo: "Premiação", valor: evento.premiacao });
  if (evento.dj) detalhes.push({ titulo: "DJ", valor: evento.dj });
  if (evento.organizadores.length > 0) {
    detalhes.push({ titulo: evento.organizadores.length > 1 ? "Organizadores" : "Organizador", valor: evento.organizadores.join(", ") });
  }

  return (
    <article className="evento">
      <div className="evento__barra">
        <Link className="voltar" to="/">Voltar para a agenda</Link>
        {ehDono && (
          <Link className="btn btn--amarelo" to={`/eventos/${evento.id}/editar`}>Editar evento</Link>
        )}
      </div>

      <header className={`evento__cartaz cartaz--${tintaDoEvento(evento.id)}`}>
        <span className="proximo__fita" aria-hidden="true" />
        <span className="proximo__data">
          <strong>{evento.data.slice(8, 10)}</strong>
          <span>{MESES_ABREV[mes]}</span>
        </span>
        <div className="evento__texto">
          <h1 className="evento__titulo">{evento.nome}</h1>
          <p className="evento__onde">{linhaOnde(evento)}</p>
          {evento.descricao && <p className="evento__desc">{evento.descricao}</p>}
        </div>
      </header>

      {detalhes.length > 0 && (
        <dl className="detalhes">
          {detalhes.map((d) => (
            <div key={d.titulo} className="detalhe">
              <dt>{d.titulo}</dt>
              <dd>{d.valor}</dd>
            </div>
          ))}
        </dl>
      )}

      <section className="secao" aria-labelledby="modalidades">
        <h2 id="modalidades" className="fita">Modalidades</h2>
        <ListaModalidades modalidades={evento.modalidades} />
      </section>

      {evento.chaves.length > 0 && (
        <section className="secao" aria-labelledby="vagas">
          <h2 id="vagas" className="fita">Vagas e check-in</h2>
          <p className="secao__texto">Escreva o seu nome em um bloco livre e marque o check-in para garantir a vaga.</p>
          {evento.chaves.map((chave) => (
            <ChaveVagas key={chave.modalidade} evento={evento} chave={chave} ehDono={ehDono} />
          ))}
        </section>
      )}

      <section className="secao" aria-labelledby="jurados">
        <h2 id="jurados" className="fita">Jurados</h2>
        {evento.jurados.length > 0 ? (
          <ListaJurados jurados={evento.jurados} />
        ) : (
          <p className="muro__vazio">Os jurados ainda serão confirmados.</p>
        )}
      </section>

      {(evento.foto || evento.linkDrive) && (
        <section className="secao" aria-labelledby="fotos">
          <h2 id="fotos" className="fita">Fotos do evento</h2>
          <figure className="polaroid">
            {evento.foto && <img src={evento.foto} alt={`Foto do evento ${evento.nome}`} />}
            {evento.linkDrive && (
              <a className="btn btn--azul polaroid__drive" href={evento.linkDrive} target="_blank" rel="noopener noreferrer">
                Ver todas as fotos no Google Drive
              </a>
            )}
          </figure>
        </section>
      )}
    </article>
  );
}
