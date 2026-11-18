import { useState, type KeyboardEvent } from "react";

interface Props {
  id: string;
  rotulo: string;
  ajuda?: string;
  placeholder: string;
  itens: string[];
  aoMudar: (itens: string[]) => void;
  max?: number;
}

/** Lista de nomes onde dá para adicionar e remover (jurados, organizadores...). */
export function ListaEditavel({ id, rotulo, ajuda, placeholder, itens, aoMudar, max = 20 }: Props) {
  const [rascunho, setRascunho] = useState("");

  function adicionar() {
    const nome = rascunho.trim();
    if (!nome || itens.length >= max) return;
    if (itens.some((i) => i.toLowerCase() === nome.toLowerCase())) {
      setRascunho("");
      return;
    }
    aoMudar([...itens, nome]);
    setRascunho("");
  }

  function aoApertar(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault(); // Enter adiciona o nome em vez de enviar o formulário
      adicionar();
    }
  }

  return (
    <div className="campo">
      <label htmlFor={id}>{rotulo}</label>
      {ajuda && <span className="campo__ajuda" id={`${id}-ajuda`}>{ajuda}</span>}

      <div className="adicionar">
        <input
          id={id}
          value={rascunho}
          onChange={(e) => setRascunho(e.target.value)}
          onKeyDown={aoApertar}
          placeholder={placeholder}
          aria-describedby={ajuda ? `${id}-ajuda` : undefined}
          maxLength={60}
        />
        <button type="button" className="btn btn--amarelo" onClick={adicionar} disabled={!rascunho.trim() || itens.length >= max}>
          Adicionar
        </button>
      </div>

      {itens.length > 0 && (
        <ul className="itens" aria-label={rotulo}>
          {itens.map((item) => (
            <li key={item} className="item">
              <span>{item}</span>
              <button
                type="button"
                className="item__remover"
                onClick={() => aoMudar(itens.filter((i) => i !== item))}
                aria-label={`Remover ${item}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
