import { useMemo, useState } from "react";
import { listarEventos } from "../data/eventosService";
import { Calendario } from "../components/Calendario";
import { CardEvento } from "../components/CardEvento";

export function CalendarioPage() {
  const hoje = new Date();
  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth());
  const [cidade, setCidade] = useState("");

  const todos = useMemo(() => listarEventos(), []);
  const cidades = useMemo(() => [...new Set(todos.map((e) => e.cidade))].sort(), [todos]);

  const eventos = useMemo(() => {
    const prefixo = `${ano}-${String(mes + 1).padStart(2, "0")}`;
    return todos
      .filter((e) => e.data.startsWith(prefixo) && (!cidade || e.cidade === cidade))
      .sort((a, b) => a.data.localeCompare(b.data));
  }, [todos, ano, mes, cidade]);

  function mudarMes(delta: number) {
    const d = new Date(ano, mes + delta, 1);
    setAno(d.getFullYear());
    setMes(d.getMonth());
  }

  const titulo = new Date(ano, mes, 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  return (
    <>
      <div className="filtro">
        <label htmlFor="cidade">Cidade:</label>
        <select id="cidade" value={cidade} onChange={(e) => setCidade(e.target.value)}>
          <option value="">Todas</option>
          {cidades.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="mes-nav">
        <button onClick={() => mudarMes(-1)} aria-label="Mês anterior">&larr;</button>
        <h2>{titulo}</h2>
        <button onClick={() => mudarMes(1)} aria-label="Próximo mês">&rarr;</button>
      </div>

      <Calendario ano={ano} mes={mes} eventos={eventos} />

      <h3 className="lista-titulo">Eventos do mês</h3>
      <div className="lista-eventos">
        {eventos.length === 0 ? (
          <p className="vazio-msg">Nenhum evento neste mês.</p>
        ) : (
          eventos.map((e) => <CardEvento key={e.id} evento={e} />)
        )}
      </div>
    </>
  );
}
