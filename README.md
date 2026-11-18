# Break Eventos

Calendário de eventos de breaking no Brasil, com foco em Recife.

## Rodar
```
npm install
npm run dev      # desenvolvimento
npm run build    # build de produção
```

## Stack
React + TypeScript + Vite + React Router

## Arquitetura (por funcionalidade)
```
src/
  app/                    -> App e rotas
  shared/                 -> o que é usado por várias features
    components/ styles/ utils/
  features/
    eventos/              -> tudo sobre eventos
      components/         -> Calendario, CardEvento, ListaJurados...
      pages/              -> CalendarioPage, EventoPage
      data/               -> eventos.ts (dados) e eventosService.ts (acesso)
      types/              -> tipos TypeScript
```
Nova funcionalidade (ex.: crews, bboys, batalhas) = nova pasta em `features/`
+ rota em `src/app/routes.tsx`.

## Adicionar evento
Edite `src/features/eventos/data/eventos.ts` (os dados atuais são só exemplo).
Quando houver API/banco, troque apenas `eventosService.ts`.
