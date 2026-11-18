import type { Jurado } from "../types/evento";

function iniciais(nome: string) {
  return nome.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("");
}

export function ListaJurados({ jurados }: { jurados: Jurado[] }) {
  return (
    <div className="jurados">
      {jurados.map((j) => (
        <div key={j.nome} className="jurado">
          <div className="avatar">{iniciais(j.nome)}</div>
          <strong>{j.nome}</strong>
          <span>{j.cidade}</span>
        </div>
      ))}
    </div>
  );
}
