import { Link, Outlet } from "react-router-dom";

export function Layout() {
  return (
    <>
      <header className="topo">
        <div className="container">
          <Link to="/" className="logo">
            Break <span>Eventos</span>
          </Link>
          <p className="sub">Calendário de eventos de breaking no Brasil</p>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}
