import { useState } from "react";
import type { Chave, Evento } from "../types/evento";
import { liberarVaga, preencherVaga } from "../data/eventosService";

interface BlocoProps {
  evento: Evento;
  chave: Chave;
  indice: number;
  ehDono: boolean;
}

function Bloco({ evento, chave, indice, ehDono }: BlocoProps) {
  const vaga = chave.vagas[indice];
  const rotulo = chave.rotulos[indice];
  const idCampo = `vaga-${evento.id}-${chave.modalidade}-${indice}`.replace(/\s+/g, "-");

  const [nome, setNome] = useState("");
  const [vou, setVou] = useState(false);
  const [erro, setErro] = useState("");

  const cheia = vaga.nome !== "";
  const smoke = rotulo === "Smoke";
  const classe = ["vaga", cheia ? "vaga--cheia" : "", smoke ? "vaga--smoke" : ""].filter(Boolean).join(" ");

  function garantir() {
    if (nome.trim().length < 2) return setErro("Escreva o nome.");
    if (!vou) return setErro("Marque o check-in.");
    setErro("");
    if (!preencherVaga(evento.id, chave.modalidade, indice, { nome, confirmado: true })) {
      setErro("Não foi possível salvar.");
    }
  }

  if (cheia) {
    return (
      <li className={classe}>
        <span className="vaga__rotulo">{rotulo}</span>
        <strong className="vaga__nome">{vaga.nome}</strong>
        <span className={vaga.confirmado ? "vaga__selo" : "vaga__selo vaga__selo--pendente"}>
          {vaga.confirmado ? "Check-in confirmado" : "Falta confirmar"}
        </span>
        {ehDono && (
          <button type="button" className="vaga__liberar" onClick={() => liberarVaga(evento.id, chave.modalidade, indice)}>
            Liberar vaga
          </button>
        )}
      </li>
    );
  }

  return (
    <li className={classe}>
      <label className="vaga__rotulo" htmlFor={idCampo}>{rotulo}</label>
      <input
        id={idCampo}
        className="vaga__input"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); garantir(); } }}
        placeholder="Seu nome"
        maxLength={40}
        autoComplete="off"
      />
      <label className="vaga__check">
        <input type="checkbox" checked={vou} onChange={(e) => setVou(e.target.checked)} />
        Confirmado, eu vou
      </label>
      <button type="button" className="btn btn--amarelo vaga__botao" onClick={garantir}>
        Garantir vaga
      </button>
      <span className="vaga__erro" role="alert">{erro}</span>
    </li>
  );
}

/** Chave de uma modalidade: os blocos de vagas, cada um com nome e check-in. */
export function ChaveVagas({ evento, chave, ehDono }: { evento: Evento; chave: Chave; ehDono: boolean }) {
  const total = chave.vagas.length;
  const preenchidas = chave.vagas.filter((v) => v.nome !== "").length;
  const confirmadas = chave.vagas.filter((v) => v.nome !== "" && v.confirmado).length;
  const completa = preenchidas === total;

  return (
    <div className="chave">
      <div className="chave__topo">
        <h3 className="chave__titulo">{chave.modalidade}</h3>
        <p className="chave__contagem" aria-live="polite">
          {completa
            ? `Chave completa: ${confirmadas} de ${total} com check-in`
            : `${preenchidas} de ${total} vagas preenchidas. Faltam ${total - preenchidas}.`}
        </p>
      </div>
      <div
        className="chave__barra"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={preenchidas}
        aria-label={`Vagas preenchidas em ${chave.modalidade}`}
      >
        <i style={{ width: `${(preenchidas / total) * 100}%` }} />
      </div>

      <ul className="vagas">
        {chave.vagas.map((_, i) => (
          <Bloco key={i} evento={evento} chave={chave} indice={i} ehDono={ehDono} />
        ))}
      </ul>
    </div>
  );
}
