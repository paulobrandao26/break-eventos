import { useMemo, useState } from "react";
import { useEventos } from "../data/eventosService";
import { Calendario } from "../components/Calendario";
import { CardEvento } from "../components/CardEvento";
import { ProximoEvento } from "../components/ProximoEvento";
import { diasAte } from "@/shared/utils/datas";

export function CalendarioPage() {
  const hoje = new Date();
  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth());
  const [cidade, setCidade] = useState("");

  const todos = useEventos();
  const cidades = useMemo(() => [...new Set(todos.map((e) => e.cidade))].sort(), [todos]);

  const proximo = useMemo(
    () =>
      [...todos]
        .filter((e) => diasAte(e.data) >= 0)
        .sort((a, b) => a.data.localeCompare(b.data))[0],
    [todos]
  );

  // Eventos do mês aberto: marcam os dias no calendário
  const eventosDoMes = useMemo(() => {
    const prefixo = `${ano}-${String(mes + 1).padStart(2, "0")}`;
    return todos
      .filter((e) => e.data.startsWith(prefixo) && (!cidade || e.cidade === cidade))
      .sort((a, b) => a.data.localeCompare(b.data));
  }, [todos, ano, mes, cidade]);

  // Lista de cartazes: todos os próximos eventos, sem depender do mês aberto
  const proximos = useMemo(
    () =>
      todos
        .filter((e) => diasAte(e.data) >= 0 && (!cidade || e.cidade === cidade))
        .sort((a, b) => a.data.localeCompare(b.data)),
    [todos, cidade]
  );

  function mudarMes(delta: number) {
    const d = new Date(ano, mes + delta, 1);
    setAno(d.getFullYear());
    setMes(d.getMonth());
  }

  const titulo = new Date(ano, mes, 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  return (
    <>
      <section className="abertura">
        <h1 className="abertura__titulo">Ache o próximo rolê de break.</h1>
        {proximo && <ProximoEvento evento={proximo} />}
      </section>

      <section className="agenda" aria-labelledby="agenda-titulo">
        <div className="agenda__cabeca">
          <h2 id="agenda-titulo" className="fita">Agenda</h2>
          <label className="filtro">
            Cidade
            <select value={cidade} onChange={(e) => setCidade(e.target.value)}>
              <option value="">Todas</option>
              {cidades.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        </div>

        <div className="mes">
          <button onClick={() => mudarMes(-1)} aria-label="Mês anterior">Anterior</button>
          <h3 className="mes__titulo">{titulo}</h3>
          <button onClick={() => mudarMes(1)} aria-label="Próximo mês">Próximo</button>
        </div>

        <Calendario ano={ano} mes={mes} eventos={eventosDoMes} />

        <h3 className="fita muro__titulo">Próximos eventos</h3>
        <div className="muro">
          {proximos.length === 0 ? (
            <p className="muro__vazio">Nenhum evento marcado por enquanto.</p>
          ) : (
            proximos.map((e, i) => <CardEvento key={e.id} evento={e} indice={i} />)
          )}
        </div>
      </section>
    </>
  );
}
