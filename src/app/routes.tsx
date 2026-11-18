import { Route, Routes } from "react-router-dom";
import { Layout } from "@/shared/components/Layout";
import { CalendarioPage } from "@/features/eventos/pages/CalendarioPage";
import { EventoPage } from "@/features/eventos/pages/EventoPage";

// Novas funcionalidades (ex.: batalhas, crews, bboys) entram aqui como novas rotas.
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<CalendarioPage />} />
        <Route path="/eventos/:id" element={<EventoPage />} />
        <Route path="*" element={<p>Página não encontrada.</p>} />
      </Route>
    </Routes>
  );
}
