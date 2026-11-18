import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

/** Itens do menu principal, na ordem em que aparecem (computador e celular). */
const ITENS_MENU = [
  { rota: '/', nome: 'Início' },
  { rota: '/sobre', nome: 'Sobre' },
  { rota: '/solucao', nome: 'Solução' },
  { rota: '/simulador', nome: 'Simulador' },
  { rota: '/faq', nome: 'FAQ' },
  { rota: '/contato', nome: 'Contato' },
  { rota: '/integrantes', nome: 'Integrantes' },
];

/**
 * Cabeçalho do site (opção A): faixa azul-marinho com a logo e o menu.
 * O NavLink marca a página atual em branco, sublinhada em menta; as outras ficam em branco translúcido.
 * No celular, o menu vira um botão (hambúrguer) que abre a lista logo abaixo do cabeçalho.
 */
export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);

  /** Fecha o menu do celular depois de escolher uma página. */
  const fecharMenu = () => setMenuAberto(false);

  /** Classe do link do computador: destaca a página atual. */
  const classeLink = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'text-branco underline decoration-menta decoration-4 underline-offset-8'
      : 'text-branco/75 transition-colors hover:text-branco';

  /** Classe do link do celular: linha inteira clicável, com no mínimo 48 px de altura. */
  const classeLinkCelular = ({ isActive }: { isActive: boolean }) =>
    `flex min-h-12 items-center rounded-xl px-3 font-semibold ${
      isActive ? 'bg-branco/10 text-branco' : 'text-branco/75 hover:bg-branco/10 hover:text-branco'
    }`;

  return (
    <header className="bg-primaria">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 lg:px-6">
        <Link to="/" onClick={fecharMenu} className="text-2xl font-extrabold text-branco">
          Acolhe<span className="text-menta">+</span>
        </Link>

        <nav aria-label="Menu principal" className="hidden items-center gap-6 font-semibold lg:flex">
          {ITENS_MENU.map(({ rota, nome }) => (
            // "end" no Início: sem ele, "/" ficaria marcado em todas as páginas
            <NavLink key={rota} to={rota} end={rota === '/'} className={classeLink}>
              {nome}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuAberto}
          aria-controls="menu-celular"
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl border border-branco/30 text-branco lg:hidden"
        >
          {menuAberto ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
        </button>
      </div>

      {menuAberto && (
        <nav id="menu-celular" aria-label="Menu principal" className="border-t border-branco/15 lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {ITENS_MENU.map(({ rota, nome }) => (
              <NavLink key={rota} to={rota} end={rota === '/'} onClick={fecharMenu} className={classeLinkCelular}>
                {nome}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
