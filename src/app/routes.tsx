import { Route, Routes } from "react-router-dom";
import { Layout } from "@/shared/components/Layout";
import { CalendarioPage } from "@/features/eventos/pages/CalendarioPage";
import { EventoPage } from "@/features/eventos/pages/EventoPage";
import { EventoFormPage } from "@/features/eventos/pages/EventoFormPage";

// Novas funcionalidades (ex.: crews, bboys, login) entram aqui como novas rotas.
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<CalendarioPage />} />
        <Route path="/eventos/novo" element={<EventoFormPage />} />
        <Route path="/eventos/:id/editar" element={<EventoFormPage />} />
        <Route path="/eventos/:id" element={<EventoPage />} />
        <Route path="*" element={<p className="muro__vazio">Página não encontrada.</p>} />
      </Route>
    </Routes>
  );
}
