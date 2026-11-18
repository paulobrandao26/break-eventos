import type { Jurado } from "../types/evento";

function iniciais(nome: string) {
  return nome.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("");
}

/** Jurados como crachás de credencial de evento. */
export function ListaJurados({ jurados }: { jurados: Jurado[] }) {
  return (
    <ul className="crachas">
      {jurados.map((j, i) => (
        <li key={j.nome} className="cracha" style={{ "--giro": `${[-1.5, 1.2, -0.8][i % 3]}deg` } as React.CSSProperties}>
          <span className="cracha__furo" aria-hidden="true" />
          <span className="cracha__foto" aria-hidden="true">{iniciais(j.nome)}</span>
          <strong className="cracha__nome">{j.nome}</strong>
          {j.cidade && <span className="cracha__cidade">{j.cidade}</span>}
          <span className="cracha__faixa">Jurado</span>
        </li>
      ))}
    </ul>
  );
}
