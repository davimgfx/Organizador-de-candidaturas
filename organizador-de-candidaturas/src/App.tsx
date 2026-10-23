import { useMemo, useState } from 'react'
import './App.css'

import { ToastProvider } from './context/ToastContext'
import { useToast } from './context/toast-context'
import { Accordion, type AccordionItem } from './components/Accordion'
import { Pagination } from './components/Pagination'
import { ProgressBar } from './components/ProgressBar'
import { Tabs, type TabItem } from './components/Tabs'
import { Dropdown, type DropdownOption } from './components/Dropdown'
import { ToastContainer } from './components/Toast'
import { Modal } from './components/Modal'

type Status = 'todas' | 'aplicada' | 'entrevista' | 'oferta' | 'recusada'

interface Candidatura {
  id: number
  empresa: string
  cargo: string
  local: string
  status: Exclude<Status, 'todas'>
  data: string
}

let proximoId = 0
const novoId = () => ++proximoId

const DADOS_INICIAIS: Omit<Candidatura, 'id'>[] = [
  { empresa: 'TechNova', cargo: 'Dev Front-end Jr.', local: 'Salvador, BA (Remoto)', status: 'entrevista', data: '2026-10-02' },
  { empresa: 'DataPrime', cargo: 'Analista de Dados', local: 'São Paulo, SP (Híbrido)', status: 'aplicada', data: '2026-10-05' },
  { empresa: 'CloudWorks', cargo: 'Engenheiro de Software', local: 'Remoto', status: 'oferta', data: '2026-09-28' },
  { empresa: 'FinByte', cargo: 'Dev Back-end Jr.', local: 'Rio de Janeiro, RJ', status: 'recusada', data: '2026-09-20' },
  { empresa: 'GreenApps', cargo: 'Desenvolvedor React', local: 'Salvador, BA', status: 'aplicada', data: '2026-10-08' },
  { empresa: 'Logix', cargo: 'QA Engineer', local: 'Remoto', status: 'entrevista', data: '2026-10-10' },
  { empresa: 'Mindset', cargo: 'Estágio em TI', local: 'Recife, PE', status: 'aplicada', data: '2026-10-11' },
  { empresa: 'Orbital', cargo: 'Dev Full-stack', local: 'Remoto', status: 'aplicada', data: '2026-10-12' },
  { empresa: 'Vektor', cargo: 'UI Developer', local: 'Curitiba, PR', status: 'oferta', data: '2026-10-01' },
  { empresa: 'Nimbus', cargo: 'DevOps Jr.', local: 'Remoto', status: 'recusada', data: '2026-09-15' },
  { empresa: 'Acme Labs', cargo: 'Dev Mobile', local: 'São Paulo, SP', status: 'entrevista', data: '2026-10-09' },
  { empresa: 'Pixel7', cargo: 'Front-end Pleno', local: 'Remoto', status: 'aplicada', data: '2026-10-13' },
]

const CANDIDATURAS_INICIAIS: Candidatura[] = DADOS_INICIAIS.map((c) => ({
  id: novoId(),
  ...c,
}))

const STATUS_LABEL: Record<Exclude<Status, 'todas'>, string> = {
  aplicada: 'Aplicada',
  entrevista: 'Entrevista',
  oferta: 'Oferta',
  recusada: 'Recusada',
}

const FILTRO_OPCOES: DropdownOption[] = [
  { label: 'Todas', value: 'todas' },
  { label: 'Aplicadas', value: 'aplicada' },
  { label: 'Em entrevista', value: 'entrevista' },
  { label: 'Com oferta', value: 'oferta' },
  { label: 'Recusadas', value: 'recusada' },
]

const STATUS_OPCOES: DropdownOption[] = FILTRO_OPCOES.filter(
  (o) => o.value !== 'todas',
)

const STATUS_ORDEM: Exclude<Status, 'todas'>[] = [
  'aplicada',
  'entrevista',
  'oferta',
  'recusada',
]

function proximoStatus(
  atual: Exclude<Status, 'todas'>,
): Exclude<Status, 'todas'> {
  const i = STATUS_ORDEM.indexOf(atual)
  return STATUS_ORDEM[(i + 1) % STATUS_ORDEM.length]
}

const FORM_VAZIO = {
  empresa: '',
  cargo: '',
  local: '',
  status: 'aplicada' as Exclude<Status, 'todas'>,
}

const FAQ: AccordionItem[] = [
  {
    title: 'Como adiciono uma nova candidatura?',
    content:
      'Clique no botão "Nova candidatura" no topo do painel. Os dados são salvos no organizador e passam a contar no progresso e nas estatísticas.',
  },
  {
    title: 'O que significam os status das candidaturas?',
    content:
      'Aplicada: você enviou o currículo. Entrevista: processo em andamento. Oferta: proposta recebida. Recusada: processo encerrado sem sucesso.',
  },
  {
    title: 'Posso filtrar as candidaturas por status?',
    content:
      'Sim. Use o menu suspenso de filtro acima da lista para exibir apenas as candidaturas de um determinado status.',
  },
  {
    title: 'Como o progresso do perfil é calculado?',
    content:
      'A barra de progresso considera as etapas preenchidas do seu perfil, como currículo, foto, habilidades e carta de apresentação.',
  },
]

const ITENS_POR_PAGINA = 4

function Organizador() {
  const { addToast } = useToast()

  const [candidaturas, setCandidaturas] = useState<Candidatura[]>(
    CANDIDATURAS_INICIAIS,
  )
  const [filtro, setFiltro] = useState<Status>('todas')
  const [paginaAtual, setPaginaAtual] = useState(1)

  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState(FORM_VAZIO)

  const candidaturasFiltradas = useMemo(() => {
    if (filtro === 'todas') return candidaturas
    return candidaturas.filter((c) => c.status === filtro)
  }, [filtro, candidaturas])

  const totalPaginas = Math.max(
    1,
    Math.ceil(candidaturasFiltradas.length / ITENS_POR_PAGINA),
  )

  const candidaturasDaPagina = useMemo(() => {
    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA
    return candidaturasFiltradas.slice(inicio, inicio + ITENS_POR_PAGINA)
  }, [candidaturasFiltradas, paginaAtual])

  const totalEtapas = 5
  const [etapasConcluidas, setEtapasConcluidas] = useState(2)
  const progressoPerfil = (etapasConcluidas / totalEtapas) * 100

  const handleFiltro = (option: DropdownOption) => {
    setFiltro(option.value as Status)
    setPaginaAtual(1)
    addToast(`Filtro aplicado: ${option.label}`, 'info')
  }

  const handlePagina = (pagina: number) => {
    setPaginaAtual(pagina)
  }

  const concluirEtapa = () => {
    if (etapasConcluidas >= totalEtapas) {
      addToast('Seu perfil já está 100% completo!', 'info')
      return
    }
    const novo = etapasConcluidas + 1
    setEtapasConcluidas(novo)
    if (novo === totalEtapas) {
      addToast('Perfil completo! Boa sorte nas candidaturas.', 'success')
    } else {
      addToast('Etapa do perfil concluída.', 'success')
    }
  }

  const abrirModal = () => {
    setForm(FORM_VAZIO)
    setModalAberto(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const empresa = form.empresa.trim()
    const cargo = form.cargo.trim()
    const local = form.local.trim()

    if (!empresa || !cargo) {
      addToast('Preencha pelo menos empresa e cargo.', 'error')
      return
    }

    const nova: Candidatura = {
      id: novoId(),
      empresa,
      cargo,
      local: local || 'Não informado',
      status: form.status,
      data: new Date().toISOString().slice(0, 10),
    }

    setCandidaturas((prev) => [nova, ...prev])
    setFiltro('todas')
    setPaginaAtual(1)
    setModalAberto(false)
    addToast(`Candidatura em ${empresa} adicionada.`, 'success')
  }

  const excluirCandidatura = (candidatura: Candidatura) => {
    setCandidaturas((prev) => prev.filter((c) => c.id !== candidatura.id))
    addToast(`Candidatura em ${candidatura.empresa} excluída.`, 'info')
  }

  const mudarStatus = (candidatura: Candidatura) => {
    const novo = proximoStatus(candidatura.status)
    setCandidaturas((prev) =>
      prev.map((c) => (c.id === candidatura.id ? { ...c, status: novo } : c)),
    )
    addToast(
      `${candidatura.empresa}: status alterado para ${STATUS_LABEL[novo]}.`,
      'success',
    )
  }

  const perfilTabs: TabItem[] = [
    {
      label: 'Resumo',
      content: (
        <div className="profile-grid">
          <p>
            Candidata a vagas de desenvolvimento web, com foco em React e
            TypeScript. Em busca da primeira oportunidade na área de tecnologia.
          </p>
          <ul className="stats">
            <li>
              <strong>{candidaturas.length}</strong> candidaturas
            </li>
            <li>
              <strong>
                {candidaturas.filter((c) => c.status === 'entrevista').length}
              </strong>{' '}
              entrevistas
            </li>
            <li>
              <strong>
                {candidaturas.filter((c) => c.status === 'oferta').length}
              </strong>{' '}
              ofertas
            </li>
          </ul>
        </div>
      ),
    },
    {
      label: 'Habilidades',
      content: (
        <ul className="skills">
          {['React', 'TypeScript', 'CSS', 'Git', 'Acessibilidade', 'Vite'].map(
            (s) => (
              <li key={s} className="skill-chip">
                {s}
              </li>
            ),
          )}
        </ul>
      ),
    },
    {
      label: 'Documentos',
      content: (
        <div className="docs">
          <p>Mantenha seus documentos atualizados para agilizar o envio.</p>
          <ul>
            <li>📄 Currículo — atualizado em 10/10/2026</li>
            <li>✉️ Carta de apresentação — modelo padrão</li>
            <li>🔗 Portfólio — github.com/usuario</li>
          </ul>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => addToast('Documento enviado com sucesso.', 'success')}
          >
            Simular upload de documento
          </button>
        </div>
      ),
    },
  ]

  return (
    <>
      <header className="app-header">
        <div className="app-header__inner">
          <h1 className="app-title">
            <span aria-hidden="true">🗂️</span> Organizador de Candidaturas
          </h1>
          <p className="app-subtitle">
            Acompanhe suas vagas, entrevistas e o progresso do seu perfil em um
            só lugar.
          </p>
          <button
            type="button"
            className="btn btn--primary"
            onClick={abrirModal}
          >
            + Nova candidatura
          </button>
        </div>
      </header>

      <main className="app-main">
        <section className="card" aria-labelledby="sec-progresso">
          <h2 id="sec-progresso">Progresso do perfil</h2>
          <p className="muted">
            Complete as etapas para aumentar suas chances de ser notado pelos
            recrutadores.
          </p>
          <ProgressBar
            value={progressoPerfil}
            label={`Perfil (${etapasConcluidas}/${totalEtapas} etapas)`}
          />
          <button
            type="button"
            className="btn btn--ghost"
            onClick={concluirEtapa}
          >
            Concluir próxima etapa
          </button>
        </section>

        <section className="card" aria-labelledby="sec-perfil">
          <h2 id="sec-perfil">Meu perfil</h2>
          <Tabs tabs={perfilTabs} />
        </section>

        <section className="card" aria-labelledby="sec-candidaturas">
          <div className="section-head">
            <h2 id="sec-candidaturas">Minhas candidaturas</h2>
            <div className="filtro">
              <label className="filtro__label" id="filtro-label">
                Filtrar por status
              </label>
              <Dropdown
                placeholder="Todas"
                options={FILTRO_OPCOES}
                value={filtro}
                onSelect={handleFiltro}
              />
            </div>
          </div>

          <p className="muted cand-hint">
            Dica: clique em uma candidatura para avançar o status, ou use o
            ícone 🗑️ para excluí-la.
          </p>

          {candidaturasDaPagina.length === 0 ? (
            <p className="muted">Nenhuma candidatura para este filtro.</p>
          ) : (
            <ul className="cand-list">
              {candidaturasDaPagina.map((c) => (
                <li key={c.id} className="cand-item">
                  <button
                    type="button"
                    className="cand-item__btn"
                    onClick={() => mudarStatus(c)}
                    title="Clique para alterar o status"
                    aria-label={`Candidatura ${c.cargo} na ${c.empresa}, status ${STATUS_LABEL[c.status]}. Clique para alterar o status.`}
                  >
                    <span className="cand-item__main">
                      <strong className="cand-item__cargo">{c.cargo}</strong>
                      <span className="cand-item__empresa">{c.empresa}</span>
                      <span className="cand-item__local">{c.local}</span>
                    </span>
                    <span
                      className={`badge badge--${c.status}`}
                      title={`Status: ${STATUS_LABEL[c.status]}`}
                    >
                      {STATUS_LABEL[c.status]}
                    </span>
                  </button>

                  <button
                    type="button"
                    className="cand-item__delete"
                    onClick={() => excluirCandidatura(c)}
                    aria-label={`Excluir candidatura em ${c.empresa}`}
                    title="Excluir candidatura"
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}

          <Pagination
            totalPages={totalPaginas}
            currentPage={paginaAtual}
            onPageChange={handlePagina}
          />
        </section>

        <section className="card" aria-labelledby="sec-faq">
          <h2 id="sec-faq">Perguntas frequentes</h2>
          <Accordion items={FAQ} singleOpen />
        </section>
      </main>

      <footer className="app-footer">
        <p>
          Organizador de Candidaturas — projeto acadêmico em React.js, Vite e
          TypeScript.
        </p>
      </footer>

      <Modal
        open={modalAberto}
        title="Nova candidatura"
        onClose={() => setModalAberto(false)}
      >
        <form className="form" onSubmit={handleSubmit}>
          <div className="form__field">
            <label htmlFor="empresa">Empresa *</label>
            <input
              id="empresa"
              type="text"
              value={form.empresa}
              onChange={(e) =>
                setForm((f) => ({ ...f, empresa: e.target.value }))
              }
              placeholder="Ex.: TechNova"
              required
              autoFocus
            />
          </div>

          <div className="form__field">
            <label htmlFor="cargo">Cargo *</label>
            <input
              id="cargo"
              type="text"
              value={form.cargo}
              onChange={(e) =>
                setForm((f) => ({ ...f, cargo: e.target.value }))
              }
              placeholder="Ex.: Dev Front-end Jr."
              required
            />
          </div>

          <div className="form__field">
            <label htmlFor="local">Local</label>
            <input
              id="local"
              type="text"
              value={form.local}
              onChange={(e) =>
                setForm((f) => ({ ...f, local: e.target.value }))
              }
              placeholder="Ex.: Salvador, BA (Remoto)"
            />
          </div>

          <div className="form__field">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  status: e.target.value as Exclude<Status, 'todas'>,
                }))
              }
            >
              {STATUS_OPCOES.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form__actions">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setModalAberto(false)}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn--primary">
              Adicionar candidatura
            </button>
          </div>
        </form>
      </Modal>

      <ToastContainer />
    </>
  )
}

function App() {
  return (
    <ToastProvider>
      <Organizador />
    </ToastProvider>
  )
}

export default App
