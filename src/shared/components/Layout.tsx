import { Link, Outlet } from "react-router-dom";

export function Layout() {
  return (
    <>
      <header className="topo">
        <div className="container topo__linha">
          <Link to="/" className="marca" aria-label="Break Eventos, página inicial">
            Break Eventos
          </Link>
          <p className="topo__frase">O calendário do break no Brasil.</p>

          <nav className="topo__acoes" aria-label="Organizador">
            <Link className="btn btn--amarelo" to="/eventos/novo">Cadastrar evento</Link>
          </nav>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}
