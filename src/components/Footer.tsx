import { Link } from 'react-router-dom';

/** Links do rodapé, na mesma ordem do menu principal. */
const LINKS_RODAPE = [
  { rota: '/', nome: 'Início' },
  { rota: '/sobre', nome: 'Sobre' },
  { rota: '/solucao', nome: 'Solução' },
  { rota: '/simulador', nome: 'Simulador' },
  { rota: '/faq', nome: 'FAQ' },
  { rota: '/contato', nome: 'Contato' },
  { rota: '/integrantes', nome: 'Integrantes' },
];

/**
 * Rodapé do site: logo, aviso de que é um projeto acadêmico, links das páginas
 * e o lembrete de emergência.
 * Regra: deixar claro que o site não tem vínculo com a Secretaria da Saúde
 * e não substitui o atendimento de saúde.
 */
export default function Footer() {
  return (
    <footer className="bg-primariaEscura text-branco">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 lg:px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row">
          <div className="max-w-sm">
            <Link to="/" className="text-2xl font-extrabold">
              Acolhe<span className="text-menta">+</span>
            </Link>
            <p className="mt-2 text-sm text-branco/70">
              Projeto acadêmico da Global Solution 2026/2 da FIAP. Protótipo sem vínculo com a Secretaria
              Municipal da Saúde.
            </p>
          </div>
          <nav
            aria-label="Links do rodapé"
            className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm font-semibold text-branco/80 sm:grid-cols-3"
          >
            {LINKS_RODAPE.map(({ rota, nome }) => (
              <Link key={rota} to={rota} className="hover:text-menta">
                {nome}
              </Link>
            ))}
          </nav>
        </div>
        <p className="border-t border-branco/15 pt-6 text-sm text-branco/60">
          Em emergência, ligue 192. Este site não substitui o atendimento de saúde.
        </p>
      </div>
    </footer>
  );
}
