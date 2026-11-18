import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { atualizarEvento, criarEvento, useEvento } from "../data/eventosService";
import { idDoOrganizador } from "../data/identidade";
import { MODALIDADES_PADRAO, VAGAS_MAX, VAGAS_MIN, modalidadePadrao } from "../data/modalidades";
import { ListaEditavel } from "../components/ListaEditavel";
import { resumirLink, validarLinkDrive } from "../utils/drive";
import { reduzirImagem } from "../utils/imagem";
import type { DadosEvento, Evento } from "../types/evento";

interface Estado {
  nome: string;
  data: string;
  horario: string;
  local: string;
  endereco: string;
  cidade: string;
  estado: string;
  descricao: string;
  padroes: string[];
  outraNome: string;
  outraVagas: string;
  jurados: string[];
  dj: string;
  organizadores: string[];
  premiacao: string;
  foto: string;
  linkDrive: string;
}

type Erros = Partial<Record<keyof Estado | "geral", string>>;

function estadoInicial(evento?: Evento): Estado {
  if (!evento) {
    return {
      nome: "", data: "", horario: "", local: "", endereco: "", cidade: "Recife", estado: "PE", descricao: "",
      padroes: [], outraNome: "", outraVagas: "", jurados: [], dj: "", organizadores: [],
      premiacao: "", foto: "", linkDrive: "",
    };
  }
  const outra = evento.chaves.find((c) => !modalidadePadrao(c.modalidade));
  return {
    nome: evento.nome,
    data: evento.data,
    horario: evento.horario ?? "",
    local: evento.local ?? "",
    endereco: evento.endereco ?? "",
    cidade: evento.cidade,
    estado: evento.estado,
    descricao: evento.descricao,
    padroes: evento.modalidades.filter((m) => modalidadePadrao(m)).map((m) => modalidadePadrao(m)!.nome),
    outraNome: outra?.modalidade ?? "",
    outraVagas: outra ? String(outra.vagas.length) : "",
    jurados: evento.jurados.map((j) => j.nome),
    dj: evento.dj ?? "",
    organizadores: evento.organizadores,
    premiacao: evento.premiacao ?? "",
    foto: evento.foto ?? "",
    linkDrive: evento.linkDrive ?? "",
  };
}

export function EventoFormPage() {
  const { id } = useParams();
  const editando = id !== undefined;
  const evento = useEvento(Number(id));

  if (editando && !evento) {
    return (
      <>
        <Link className="voltar" to="/">Voltar para a agenda</Link>
        <p className="muro__vazio">Esse evento não existe ou foi removido.</p>
      </>
    );
  }
  if (editando && evento && evento.donoId !== idDoOrganizador()) {
    return (
      <>
        <Link className="voltar" to={`/eventos/${evento.id}`}>Voltar para o evento</Link>
        <p className="muro__vazio">Só quem cadastrou este evento pode editá-lo.</p>
      </>
    );
  }

  // O formulário é montado só depois de saber qual evento é, para o estado inicial ficar certo
  return <Formulario key={evento?.id ?? "novo"} evento={evento} />;
}

function Formulario({ evento }: { evento?: Evento }) {
  const navegar = useNavigate();
  const [dados, setDados] = useState<Estado>(() => estadoInicial(evento));
  const [erros, setErros] = useState<Erros>({});
  const [rascunhoDrive, setRascunhoDrive] = useState("");
  const [erroDrive, setErroDrive] = useState("");
  const [enviando, setEnviando] = useState(false);
  const arquivoRef = useRef<HTMLInputElement>(null);

  function mudar<K extends keyof Estado>(campo: K, valor: Estado[K]) {
    setDados((d) => ({ ...d, [campo]: valor }));
    setErros((e) => ({ ...e, [campo]: undefined }));
  }

  function alternarPadrao(nome: string) {
    mudar("padroes", dados.padroes.includes(nome) ? dados.padroes.filter((p) => p !== nome) : [...dados.padroes, nome]);
  }

  async function escolherFoto(e: ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    e.target.value = "";
    if (!arquivo) return;
    try {
      mudar("foto", await reduzirImagem(arquivo));
      setErros((er) => ({ ...er, foto: undefined }));
    } catch (erro) {
      setErros((er) => ({ ...er, foto: erro instanceof Error ? erro.message : "Não foi possível usar essa foto." }));
    }
  }

  function importarLink() {
    const r = validarLinkDrive(rascunhoDrive);
    if (!r.ok) return setErroDrive(r.erro);
    setErroDrive("");
    mudar("linkDrive", r.url);
    setRascunhoDrive("");
  }

  function montarDados(): { dados?: DadosEvento; erros: Erros } {
    const novos: Erros = {};
    if (dados.nome.trim().length < 3) novos.nome = "Digite o nome do evento (mínimo 3 letras).";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dados.data)) novos.data = "Escolha a data do evento.";
    if (!dados.cidade.trim()) novos.cidade = "Digite a cidade.";
    if (!/^[A-Za-z]{2}$/.test(dados.estado.trim())) novos.estado = "Use a sigla do estado (ex.: PE).";

    const modalidades: DadosEvento["modalidades"] = dados.padroes.map((nome) => ({ nome }));
    if (dados.outraNome.trim()) {
      const vagas = Number(dados.outraVagas);
      if (!Number.isInteger(vagas) || vagas < VAGAS_MIN || vagas > VAGAS_MAX) {
        novos.outraVagas = `Informe de ${VAGAS_MIN} a ${VAGAS_MAX} vagas.`;
      } else if (modalidadePadrao(dados.outraNome)) {
        novos.outraNome = "Essa já está na lista acima. Marque a opção pronta.";
      } else {
        modalidades.push({ nome: dados.outraNome.trim(), vagas });
      }
    }
    if (modalidades.length === 0 && !novos.outraVagas && !novos.outraNome) {
      novos.padroes = "Escolha pelo menos uma modalidade.";
    }

    if (Object.keys(novos).length > 0) return { erros: novos };

    return {
      erros: novos,
      dados: {
        nome: dados.nome, data: dados.data, horario: dados.horario, local: dados.local, endereco: dados.endereco,
        cidade: dados.cidade, estado: dados.estado, descricao: dados.descricao, modalidades,
        jurados: dados.jurados, dj: dados.dj, organizadores: dados.organizadores, premiacao: dados.premiacao,
        foto: dados.foto, linkDrive: dados.linkDrive,
      },
    };
  }

  function enviar(e: FormEvent) {
    e.preventDefault();
    const r = montarDados();
    setErros(r.erros);
    if (!r.dados) {
      document.querySelector<HTMLElement>("[data-erro-campo='true']")?.focus();
      return;
    }

    setEnviando(true);
    const resultado = evento
      ? atualizarEvento(evento.id, r.dados, idDoOrganizador())
      : criarEvento(r.dados, idDoOrganizador());
    setEnviando(false);

    if (resultado.ok) navegar(`/eventos/${resultado.valor.id}`);
    else setErros({ geral: resultado.erro });
  }

  const erroProps = (campo: keyof Estado) => ({
    "aria-invalid": erros[campo] ? true : undefined,
    "data-erro-campo": erros[campo] ? "true" : undefined,
  });

  return (
    <section className="cadastro">
      <Link className="voltar" to={evento ? `/eventos/${evento.id}` : "/"}>
        {evento ? "Voltar para o evento" : "Voltar para a agenda"}
      </Link>
      <h1 className="cadastro__titulo">{evento ? "Editar evento" : "Cadastrar evento"}</h1>
      <p className="cadastro__texto">Preencha os dados do seu evento. Tudo pode ser editado depois.</p>

      <form className="folha-form" onSubmit={enviar} noValidate>
        {/* ---------- Dados ---------- */}
        <fieldset className="grupo">
          <legend className="fita fita--pequena">O evento</legend>

          <div className="campo">
            <label htmlFor="f-nome">Nome do evento</label>
            <input id="f-nome" value={dados.nome} onChange={(e) => mudar("nome", e.target.value)} maxLength={70} {...erroProps("nome")} />
            <span className="campo__erro" role="alert">{erros.nome}</span>
          </div>

          <div className="linha-2">
            <div className="campo">
              <label htmlFor="f-data">Data</label>
              <input id="f-data" type="date" value={dados.data} onChange={(e) => mudar("data", e.target.value)} {...erroProps("data")} />
              <span className="campo__erro" role="alert">{erros.data}</span>
            </div>
            <div className="campo">
              <label htmlFor="f-horario">Horário <span className="opcional">(opcional)</span></label>
              <input id="f-horario" type="time" value={dados.horario} onChange={(e) => mudar("horario", e.target.value)} />
            </div>
          </div>

          <div className="campo">
            <label htmlFor="f-descricao">Descrição <span className="opcional">(opcional)</span></label>
            <textarea id="f-descricao" rows={3} value={dados.descricao} onChange={(e) => mudar("descricao", e.target.value)} maxLength={400} />
          </div>
        </fieldset>

        {/* ---------- Endereço ---------- */}
        <fieldset className="grupo">
          <legend className="fita fita--pequena">Endereço</legend>

          <div className="campo">
            <label htmlFor="f-local">Nome do local <span className="opcional">(opcional)</span></label>
            <input id="f-local" value={dados.local} onChange={(e) => mudar("local", e.target.value)} placeholder="Ex.: Praça do Arsenal" maxLength={70} />
          </div>

          <div className="campo">
            <label htmlFor="f-endereco">Rua, número e bairro <span className="opcional">(opcional)</span></label>
            <input id="f-endereco" value={dados.endereco} onChange={(e) => mudar("endereco", e.target.value)} maxLength={120} />
          </div>

          <div className="linha-cidade">
            <div className="campo">
              <label htmlFor="f-cidade">Cidade</label>
              <input id="f-cidade" value={dados.cidade} onChange={(e) => mudar("cidade", e.target.value)} {...erroProps("cidade")} />
              <span className="campo__erro" role="alert">{erros.cidade}</span>
            </div>
            <div className="campo">
              <label htmlFor="f-estado">UF</label>
              <input id="f-estado" value={dados.estado} onChange={(e) => mudar("estado", e.target.value.toUpperCase())} maxLength={2} {...erroProps("estado")} />
              <span className="campo__erro" role="alert">{erros.estado}</span>
            </div>
          </div>
        </fieldset>

        {/* ---------- Modalidades ---------- */}
        <fieldset className="grupo">
          <legend className="fita fita--pequena">Modalidades e vagas</legend>
          <p className="campo__ajuda">Cada modalidade abre uma chave com blocos de vagas, onde cada participante escreve o nome e confirma o check-in.</p>

          <div className="opcoes">
            {MODALIDADES_PADRAO.map((m) => {
              const ativa = dados.padroes.includes(m.nome);
              return (
                <label key={m.nome} className={ativa ? "opcao opcao--ativa" : "opcao"}>
                  <input type="checkbox" checked={ativa} onChange={() => alternarPadrao(m.nome)} />
                  <span>
                    <strong>{m.nome}</strong>
                    <small>{m.ajuda}</small>
                  </span>
                </label>
              );
            })}
          </div>
          <span className="campo__erro" role="alert">{erros.padroes}</span>

          <div className="linha-2 linha-2--outra">
            <div className="campo">
              <label htmlFor="f-outra">Outra modalidade <span className="opcional">(opcional)</span></label>
              <input id="f-outra" value={dados.outraNome} onChange={(e) => mudar("outraNome", e.target.value)} placeholder="Ex.: 2 vs 2" maxLength={30} {...erroProps("outraNome")} />
              <span className="campo__erro" role="alert">{erros.outraNome}</span>
            </div>
            <div className="campo">
              <label htmlFor="f-vagas">Número de vagas</label>
              <input id="f-vagas" type="number" inputMode="numeric" min={VAGAS_MIN} max={VAGAS_MAX} value={dados.outraVagas} onChange={(e) => mudar("outraVagas", e.target.value)} {...erroProps("outraVagas")} />
              <span className="campo__erro" role="alert">{erros.outraVagas}</span>
            </div>
          </div>
        </fieldset>

        {/* ---------- Equipe ---------- */}
        <fieldset className="grupo">
          <legend className="fita fita--pequena">Equipe</legend>
          <ListaEditavel id="f-jurado" rotulo="Jurados" ajuda="Pode deixar vazio se ainda não foram confirmados." placeholder="Nome do jurado" itens={dados.jurados} aoMudar={(v) => mudar("jurados", v)} />
          <div className="campo">
            <label htmlFor="f-dj">DJ <span className="opcional">(opcional)</span></label>
            <input id="f-dj" value={dados.dj} onChange={(e) => mudar("dj", e.target.value)} maxLength={60} />
          </div>
          <ListaEditavel id="f-org" rotulo="Organizadores" placeholder="Nome do organizador" itens={dados.organizadores} aoMudar={(v) => mudar("organizadores", v)} />
        </fieldset>

        {/* ---------- Premiação ---------- */}
        <fieldset className="grupo">
          <legend className="fita fita--pequena">Premiação</legend>
          <div className="campo">
            <label htmlFor="f-premio">O que o campeão ganha <span className="opcional">(opcional)</span></label>
            <textarea id="f-premio" rows={2} value={dados.premiacao} onChange={(e) => mudar("premiacao", e.target.value)} placeholder="Ex.: R$ 500 e troféu" maxLength={200} />
          </div>
        </fieldset>

        {/* ---------- Fotos ---------- */}
        <fieldset className="grupo">
          <legend className="fita fita--pequena">Fotos do evento</legend>

          <div className="campo">
            <span className="rotulo">Foto de capa <span className="opcional">(uma foto)</span></span>
            {dados.foto ? (
              <div className="previa">
                <img src={dados.foto} alt="Prévia da foto do evento" />
                <div className="previa__acoes">
                  <button type="button" className="btn" onClick={() => arquivoRef.current?.click()}>Trocar foto</button>
                  <button type="button" className="btn btn--vazio-escuro" onClick={() => mudar("foto", "")}>Remover</button>
                </div>
              </div>
            ) : (
              <button type="button" className="enviar-foto" onClick={() => arquivoRef.current?.click()}>
                <strong>Escolher foto</strong>
                <small>JPG, PNG ou WebP</small>
              </button>
            )}
            <input ref={arquivoRef} type="file" accept="image/*" hidden onChange={escolherFoto} aria-label="Escolher foto do evento" />
            <span className="campo__erro" role="alert">{erros.foto}</span>
          </div>

          <div className="campo">
            <label htmlFor="f-drive">Link do Google Drive <span className="opcional">(opcional)</span></label>
            <span className="campo__ajuda">Cole o link da pasta com todas as fotos do evento.</span>
            {dados.linkDrive ? (
              <div className="link-importado">
                <span className="link-importado__selo">Link importado</span>
                <a href={dados.linkDrive} target="_blank" rel="noopener noreferrer">{resumirLink(dados.linkDrive)}</a>
                <button type="button" className="btn btn--vazio-escuro" onClick={() => mudar("linkDrive", "")}>Remover</button>
              </div>
            ) : (
              <>
                <div className="adicionar">
                  <input
                    id="f-drive"
                    type="url"
                    value={rascunhoDrive}
                    onChange={(e) => { setRascunhoDrive(e.target.value); setErroDrive(""); }}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); importarLink(); } }}
                    placeholder="https://drive.google.com/..."
                    aria-invalid={erroDrive ? true : undefined}
                  />
                  <button type="button" className="btn btn--azul" onClick={importarLink}>Importar link</button>
                </div>
                <span className="campo__erro" role="alert">{erroDrive}</span>
              </>
            )}
          </div>
        </fieldset>

        <p className="campo__erro campo__erro--geral" role="alert">{erros.geral}</p>

        <div className="acoes-form">
          <button className="btn btn--amarelo btn--grande" type="submit" disabled={enviando}>
            {enviando ? "Salvando..." : evento ? "Salvar alterações" : "Cadastrar evento"}
          </button>
          <Link className="btn btn--vazio-escuro" to={evento ? `/eventos/${evento.id}` : "/"}>Cancelar</Link>
        </div>
      </form>
    </section>
  );
}
