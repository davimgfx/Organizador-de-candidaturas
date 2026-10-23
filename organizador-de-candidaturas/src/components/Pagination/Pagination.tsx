import type { PaginationProps } from './Pagination.types'

export function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const isFirst = currentPage <= 1
  const isLast = currentPage >= totalPages

  return (
    <nav className="pagination" aria-label="Paginação das candidaturas">
      <button
        type="button"
        className="pagination__btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirst}
        aria-label="Página anterior"
      >
        ‹ Anterior
      </button>

      <ul className="pagination__list">
        {pages.map((page) => (
          <li key={page}>
            <button
              type="button"
              className={`pagination__page ${
                page === currentPage ? 'is-active' : ''
              }`}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? 'page' : undefined}
              aria-label={`Ir para a página ${page}`}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="pagination__btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLast}
        aria-label="Próxima página"
      >
        Próxima ›
      </button>
    </nav>
  )
}
