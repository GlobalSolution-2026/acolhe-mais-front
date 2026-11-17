/**
 * Página: aba Recepção UBS (/simulador/recepcao)
 * Painel largo da recepção (no lugar do celular): escolha da UBS, abas internas (Agenda, Balcão,
 * Pendentes, Lista do dia e Indicadores, com NavLink + Outlet) e os botões do modo demonstração.
 * Ao lado, o painel "Perfis para testar" (Cartões SUS para o balcão) e o de explicação da aba interna aberta.
 * Veio do protótipo: LayoutRecepcao + LayoutCompartilhado (seletor da UBS) + ModoDemonstracao.
 * Endpoints: GET /unidades (API Java, lista de UBS do seletor). Cada aba interna chama os seus.
 * Estados: carregando, erro e vazio na lista de UBS. Login da recepção: demonstração.
 */
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import type { IconType } from 'react-icons';
import { FiBarChart2, FiCalendar, FiClock, FiList, FiUsers } from 'react-icons/fi';
import EstadoVazio from '../../../components/EstadoVazio';
import LayoutAba from '../../../components/LayoutAba';
import Loading from '../../../components/Loading';
import MensagemErro from '../../../components/MensagemErro';
import PainelExplicacao from '../../../components/PainelExplicacao';
import PerfisTeste from '../../../components/PerfisTeste';
import SeloDemonstracao from '../../../components/SeloDemonstracao';
import ModoDemonstracaoRecepcao from '../../../components/recepcao/ModoDemonstracaoRecepcao';
import { useSimulador } from '../../../context/useSimulador';
import { explicacaoRecepcao } from '../../../data/explicacoesRecepcao';
import { useCarregar } from '../../../hooks/useCarregar';
import { listarUnidades } from '../../../services/api';

/** Abas internas do painel da recepção (rota relativa a /simulador/recepcao). */
const ABAS: { rota: string; nome: string; icone: IconType }[] = [
  { rota: 'agenda', nome: 'Agenda', icone: FiCalendar },
  { rota: 'balcao', nome: 'Balcão', icone: FiUsers },
  { rota: 'pendentes', nome: 'Pendentes', icone: FiClock },
  { rota: 'lista-do-dia', nome: 'Lista do dia', icone: FiList },
  { rota: 'indicadores', nome: 'Indicadores', icone: FiBarChart2 },
];

/** Aba Recepção UBS: painel com seletor de UBS e abas internas. */
export default function AbaRecepcao() {
  const { estado, selecionarUnidadeRecepcao } = useSimulador();
  const { pathname } = useLocation();
  const { dados: ubs, carregando, erro, recarregar } = useCarregar(() => listarUnidades('UBS'), []);
  const tela = pathname.split('/')[3] ?? 'agenda';

  return (
    <LayoutAba
      explicacao={
        <div className="flex flex-col gap-4">
          <PerfisTeste />
          <PainelExplicacao {...explicacaoRecepcao(tela)} />
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <section className="flex flex-col gap-4 rounded-xl border border-borda bg-branco p-4 shadow-leve">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-1 md:w-80">
              <label htmlFor="ubsRecepcao" className="font-semibold">UBS da recepção</label>
              {carregando && <Loading />}
              {erro && <MensagemErro mensagem={erro} onRetry={recarregar} />}
              {!carregando && !erro && ubs?.length === 0 && <EstadoVazio mensagem="Nenhuma UBS cadastrada." />}
              {!carregando && !erro && ubs && ubs.length > 0 && (
                <select
                  id="ubsRecepcao"
                  value={estado.idUnidadeRecepcao}
                  onChange={(e) => selecionarUnidadeRecepcao(Number(e.target.value))}
                  className="min-h-12 w-full rounded-xl border border-borda bg-branco px-4 font-bold text-texto outline-none focus:ring-2 focus:ring-primaria"
                >
                  {ubs.map((u) => <option key={u.idUnidade} value={u.idUnidade}>{u.nmUnidade}</option>)}
                </select>
              )}
            </div>
            <SeloDemonstracao descricao="Login da recepção em demonstração: o painel abre direto na UBS escolhida." />
          </div>
          <nav aria-label="Abas da recepção">
            <ul className="flex flex-wrap gap-2">
              {ABAS.map(({ rota, nome, icone: Icone }) => (
                <li key={rota}>
                  <NavLink
                    to={rota}
                    className={({ isActive }) =>
                      `inline-flex min-h-12 items-center gap-2 rounded-xl border px-4 font-bold transition-colors ${
                        isActive ? 'border-primaria bg-primaria text-branco' : 'border-borda bg-branco text-primaria hover:bg-mentaSuave'
                      }`
                    }
                  >
                    <Icone aria-hidden /> {nome}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </section>

        {/* key: trocar de UBS recomeça a aba aberta (ex.: um atendimento de balcão pela metade) */}
        <section key={estado.idUnidadeRecepcao} aria-label="Conteúdo da recepção" className="rounded-xl border border-borda bg-fundo p-4">
          <Outlet />
        </section>

        <ModoDemonstracaoRecepcao />
      </div>
    </LayoutAba>
  );
}
