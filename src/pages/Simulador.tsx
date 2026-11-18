/**
 * Página: Simulador Acolhe+ (/simulador) — layout de todas as abas
 * Topo com o nome do simulador e o botão "Reiniciar demonstração", as 5 abas (NavLink)
 * e o <Outlet /> onde aparece a aba escolhida. Também monta os contextos do modo demonstração
 * (SimuladorProvider) e das requisições (RequisicoesProvider), usados por todas as abas,
 * e o balão de requisições no canto inferior esquerdo (BalaoRequisicoes).
 * Veio do protótipo: LayoutCompartilhado e ModoDemonstracao (botão de reiniciar com confirmação).
 * Endpoints: nenhum (cada aba chama os seus).
 * Estados: não se aplica; mostra o selo "Demonstração" quando a API Java não está configurada
 * e o aviso de dia simulado quando hoje não é dia útil.
 */
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import type { IconType } from 'react-icons';
import { FiActivity, FiAlertTriangle, FiBarChart2, FiClipboard, FiRotateCcw, FiSmartphone } from 'react-icons/fi';
import { RequisicoesProvider } from '../context/RequisicoesContext';
import { SimuladorProvider } from '../context/SimuladorContext';
import { useSimulador } from '../context/useSimulador';
import Botao from '../components/Botao';
import SeloDemonstracao from '../components/SeloDemonstracao';
import BalaoRequisicoes from '../components/status/BalaoRequisicoes';
import { fmtDiaSemanaData } from '../lib/datas';
import { diaSimulado } from '../lib/relogio';
import { API_URL } from '../services/api';

/** As 5 abas do simulador (rota relativa a /simulador, nome e ícone). */
const ABAS: { rota: string; nome: string; icone: IconType }[] = [
  { rota: 'cidadao', nome: 'Cidadão', icone: FiSmartphone },
  { rota: 'recepcao', nome: 'Recepção UBS', icone: FiClipboard },
  { rota: 'status', nome: 'Status das APIs', icone: FiActivity },
  { rota: 'ia-risco-falta', nome: 'IA – Risco de falta', icone: FiBarChart2 },
  { rota: 'ia-urgencia', nome: 'IA – Verificação de urgência', icone: FiAlertTriangle },
];

/**
 * Botão "Reiniciar demonstração" com confirmação (apaga o que foi feito e volta aos dados de exemplo).
 */
function BotaoReiniciar() {
  const { reiniciarDemonstracao } = useSimulador();
  const navigate = useNavigate();
  const [confirmando, setConfirmando] = useState(false);

  /** Reinicia o mock e volta para a aba Cidadão. */
  const reiniciar = () => {
    reiniciarDemonstracao();
    setConfirmando(false);
    navigate('/simulador/cidadao');
  };

  if (!confirmando) {
    return (
      <Botao variante="simuladorContorno" acao={() => setConfirmando(true)}>
        <FiRotateCcw aria-hidden /> Reiniciar demonstração
      </Botao>
    );
  }
  return (
    <div role="alertdialog" aria-label="Confirmar reinício" className="flex flex-col gap-2 rounded-xl border border-borda bg-branco p-3 shadow-leve">
      <p className="font-semibold">Apagar tudo e voltar ao início da demonstração?</p>
      <div className="grid grid-cols-2 gap-2">
        <Botao variante="simuladorContorno" acao={() => setConfirmando(false)}>Cancelar</Botao>
        <Botao variante="simulador" acao={reiniciar}>Sim, reiniciar</Botao>
      </div>
    </div>
  );
}

/**
 * Topo do simulador: título, explicação curta, selo de demonstração, aviso de dia simulado e reiniciar.
 */
function CabecalhoSimulador() {
  // DEMONSTRAÇÃO: em sábado, domingo ou feriado, o simulador trata o próximo dia útil como hoje.
  const simulado = diaSimulado();
  return (
    <header className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold text-primaria md:text-4xl">Simulador Acolhe+</h1>
          <p className="max-w-2xl text-textoSuave">
            Veja a solução funcionando pelos dois lados: o celular do cidadão e o painel da recepção da UBS,
            além da situação das APIs e dos dois modelos de IA.
          </p>
        </div>
        <div className="shrink-0">
          <BotaoReiniciar />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {!API_URL && <SeloDemonstracao />}
        {simulado && (
          <p role="status" className="rounded-full border border-dashed border-primaria/40 bg-mentaSuave px-3 py-1 text-sm font-bold text-primaria">
            Demonstração: simulando {fmtDiaSemanaData(simulado)}
          </p>
        )}
      </div>
    </header>
  );
}

/** Menu das 5 abas (NavLink marca a aba aberta). Quebra linha no celular para não rolar de lado. */
function MenuAbas() {
  return (
    <nav aria-label="Abas do simulador">
      <ul className="flex flex-wrap gap-2">
        {ABAS.map(({ rota, nome, icone: Icone }) => (
          <li key={rota}>
            <NavLink
              to={rota}
              className={({ isActive }) =>
                `inline-flex min-h-12 items-center gap-2 rounded-xl border px-4 font-bold transition-colors ${
                  isActive
                    ? 'border-primaria bg-primaria text-branco shadow-leve'
                    : 'border-borda bg-branco text-primaria hover:bg-mentaSuave'
                }`
              }
            >
              <Icone aria-hidden />
              {nome}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Layout do simulador com os contextos, o topo, as abas e a aba aberta (Outlet). */
export default function Simulador() {
  return (
    <RequisicoesProvider>
      <SimuladorProvider>
        <div className="bg-fundo font-nunito text-texto">
          {/* pb-28 abaixo de 1024 px: espaço para o balão de requisições (faixa embaixo) não cobrir o fim da página */}
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 pb-28 pt-8 sm:px-6 lg:px-8 lg:pb-16">
            <CabecalhoSimulador />
            <MenuAbas />
            <Outlet />
          </div>
        </div>
        <BalaoRequisicoes />
      </SimuladorProvider>
    </RequisicoesProvider>
  );
}
