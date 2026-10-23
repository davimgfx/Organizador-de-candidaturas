# Organizador de Candidaturas

Aplicação em **React.js + TypeScript + Vite** para organizar candidaturas a vagas
de emprego: acompanhar status, entrevistas e o progresso do perfil.

Projeto acadêmico — Universidade Católica do Salvador / Engenharia de Software.

## Como executar

```bash
npm install
npm run dev      # servidor de desenvolvimento (http://localhost:5173)
npm run build    # build de produção (tsc + vite)
npm run lint     # verificação de código (ESLint)
```

> Observação: caso o `npm install` falhe com o erro `Cannot read properties of
> null (reading 'edgesOut')` (bug conhecido do resolvedor de dependências do
> npm), use `npm install --legacy-peer-deps`.

## Arquitetura

A aplicação segue a arquitetura de componentes do React. O componente principal
`src/App.tsx` orquestra todos os demais e injeta o provedor de estado global.

```
src/
├─ App.tsx                 # Componente principal (orquestra tudo)
├─ context/
│  ├─ toast-context.ts     # Contexto + hook useToast (estado global)
│  └─ ToastContext.tsx     # ToastProvider (Context API)
└─ components/
   ├─ Accordion.tsx        # 1. Acordeão (FAQ)
   ├─ Pagination.tsx       # 2. Paginação (lista de candidaturas)
   ├─ ProgressBar.tsx      # 3. Barra de Progresso (perfil)
   ├─ Tabs.tsx             # 4. Abas (perfil do usuário)
   ├─ Dropdown.tsx         # 5. Menu Suspenso (filtro de status)
   └─ Toast.tsx            # 6. Notificação Toast (feedback)
```

## Os 6 componentes obrigatórios

| # | Componente | Onde é usado | Destaques |
|---|------------|--------------|-----------|
| 1 | **Acordeão** | Perguntas Frequentes | Um item aberto por vez, transição suave, `aria-expanded` |
| 2 | **Paginação** | Lista de candidaturas | Anterior/Próxima desabilitados nos extremos, página atual com `aria-current` |
| 3 | **Barra de Progresso** | Progresso do perfil | Valor 0–100 via props, `role="progressbar"` |
| 4 | **Abas** | Perfil do usuário | Estado da aba ativa, navegação por teclado (setas), padrão ARIA Tabs |
| 5 | **Menu Suspenso** | Filtro por status | Fecha ao selecionar, ao clicar fora e com Esc |
| 6 | **Notificação Toast** | Feedback de ações | Tipos sucesso/erro/info, some sozinho, `aria-live` |

## Conceitos de React demonstrados

- **Componentes funcionais** com tipagem via TypeScript.
- **Props** para passar dados e callbacks entre componentes.
- **State local** com `useState` em cada componente interativo.
- **Hooks**: `useState`, `useEffect` (fechar dropdown ao clicar fora),
  `useMemo` (filtragem/paginação derivada), `useCallback`, `useContext`.
- **Manipulação de eventos**: clique, teclado (`onKeyDown`), clique fora.

## Responsividade

Layout fluido com CSS Grid/Flexbox e `clamp()`. Breakpoints para tablet
(`max-width: 720px`) e smartphone (`max-width: 480px`), além de respeitar
`prefers-reduced-motion`.

## Desafio Extra — Estado Global (Context API)

As notificações Toast usam a **Context API** (`ToastProvider` + `useToast`),
permitindo que qualquer componente dispare feedback sem passar props
manualmente entre componentes não relacionados.

## Acessibilidade

- Tags semânticas HTML5 (`header`, `main`, `nav`, `section`, `footer`).
- Atributos ARIA: `aria-expanded`, `aria-controls`, `aria-current`,
  `aria-selected`, `role="progressbar"`, `role="tablist/tab/tabpanel"`,
  `role="menu/menuitem"`, `aria-live`.
- Foco visível via `:focus-visible` e navegação por teclado nas abas.
