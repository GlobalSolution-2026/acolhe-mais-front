import { Link, NavLink, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import type { IconType } from 'react-icons';
import { FiAlertTriangle, FiBell, FiCalendar, FiChevronLeft, FiHome, FiUser } from 'react-icons/fi';
import { AvisosContext } from '../../context/avisosContexto';
import { useSimulador } from '../../context/useSimulador';
import { useCarregarAvisos } from '../../hooks/useAvisos';
import { BASE_CELULAR, rotaPai } from '../../services/navegacao';

interface ItemBarraProps {
  /** Rota relativa ao celular (ex.: "inicio"). */
  rota: string;
  nome: string;
  icone: IconType;
}

/** Item da barra inferior do celular (NavLink marca a tela aberta). */
function ItemBarra({ rota, nome, icone: Icone }: ItemBarraProps) {
  return (
    <NavLink
      to={`${BASE_CELULAR}/${rota}`}
      className={({ isActive }) =>
        `flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-xs font-bold ${
          isActive ? 'text-primaria' : 'text-textoSuave'
        }`
      }
    >
      <Icone size={22} aria-hidden />
      {nome}
    </NavLink>
  );
}

/**
 * Moldura do celular do cidadão (aba Cidadão do simulador). Veio do protótipo: LayoutCidadao + LayoutCompartilhado.
 * - Topo: voltar (quando a tela tem uma tela "pai"), logo Acolhe+ e sino de avisos com contador.
 *   O contador usa os mesmos avisos da tela Avisos (useCarregarAvisos, com GET /consultas), entregues às telas
 *   pelo AvisosContext. Sem login, mostra 0 sem chamar a API.
 * - Meio: a tela aberta (<Outlet />), que rola dentro do celular.
 * - Barra inferior fixa: Início, Consultas, Emergência (botão redondo vermelho, maior e acima da barra), Avisos e Perfil.
 */
export default function Celular() {
  const { pathname } = useLocation();
  const [parametros] = useSearchParams();
  const { estado } = useSimulador();

  // No Agendar, o voltar leva aos horários da UBS escolhida (?ubs= na URL; sem ele, procura o horário no mock).
  const idHorario = Number(parametros.get('horario'));
  const idUnidade = Number(parametros.get('ubs')) || estado.horarios.find((h) => h.idHorario === idHorario)?.idUnidade;
  const pai = rotaPai(pathname, idUnidade);

  // Contador do sino: pedidos de confirmação na janela + ofertas de vaga da lista do dia (só do cidadão logado).
  // Carregado uma vez aqui e entregue às telas, para o sino e a tela Avisos mostrarem o mesmo número.
  const dadosAvisos = useCarregarAvisos();
  const avisos = dadosAvisos.total;

  return (
    <div className="mx-auto w-full max-w-[400px]">
      <div className="relative flex h-[760px] flex-col overflow-hidden rounded-[2.5rem] border-[10px] border-primariaEscura bg-branco text-[18px] text-texto shadow-celular">
        <header className="z-20 bg-primaria text-branco">
          <div className="flex h-16 items-center gap-1 px-2">
            <div className="w-12">
              {pai && (
                <Link to={pai} aria-label="Voltar" className="flex h-12 w-12 items-center justify-center rounded-xl hover:bg-primariaEscura">
                  <FiChevronLeft size={26} aria-hidden />
                </Link>
              )}
            </div>
            <span className="text-xl font-extrabold">
              Acolhe<span className="text-menta">+</span>
            </span>
            <Link
              to={`${BASE_CELULAR}/avisos`}
              aria-label={`Avisos: ${avisos}`}
              className="relative ml-auto flex h-12 w-12 items-center justify-center rounded-xl hover:bg-primariaEscura"
            >
              <FiBell size={24} aria-hidden />
              <span className="absolute right-1.5 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-menta px-1 text-xs font-extrabold text-primariaEscura">
                {avisos}
              </span>
            </Link>
          </div>
        </header>

        {/* pb-12: espaço para o botão de Emergência, que sobe por cima do fim do conteúdo.
            É uma <section> (e não <main>) porque o site já tem o <main> do Layout. */}
        <section aria-label="Tela do celular" className="flex-1 overflow-y-auto bg-fundo p-4 pb-12">
          <AvisosContext.Provider value={dadosAvisos}>
            <Outlet />
          </AvisosContext.Provider>
        </section>

        <nav aria-label="Menu do cidadão" className="z-20 flex items-end border-t border-borda bg-branco px-2 pb-2 pt-1">
          <ItemBarra rota="inicio" nome="Início" icone={FiHome} />
          <ItemBarra rota="consultas" nome="Consultas" icone={FiCalendar} />
          <div className="flex flex-1 justify-center">
            <NavLink
              to={`${BASE_CELULAR}/emergencia`}
              aria-label="Emergência"
              className="-mt-10 flex h-20 w-20 flex-col items-center justify-center rounded-full border-4 border-branco bg-gravidade-vermelho text-[11px] font-extrabold text-branco shadow-celular"
            >
              <FiAlertTriangle size={26} aria-hidden />
              Emergência
            </NavLink>
          </div>
          <ItemBarra rota="avisos" nome="Avisos" icone={FiBell} />
          <ItemBarra rota="perfil" nome="Perfil" icone={FiUser} />
        </nav>
      </div>
    </div>
  );
}
