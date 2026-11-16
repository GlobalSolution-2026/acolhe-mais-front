/**
 * Página: Minhas consultas (aba Cidadão → celular, /simulador/cidadao/consultas)
 * Lista as consultas de quem está logado (próximas e anteriores), com o prazo de confirmação,
 * o botão "Confirmar presença" (na janela de confirmação) e "Não vou poder ir" (cancela e libera o horário).
 * Veio do protótipo: src/pages/cidadao/Consultas.tsx.
 * Endpoints: GET /consultas e PUT /consultas/{id}/status (API Java).
 * Estados: sem login, carregando, erro, vazio (sem consultas), "Aguarde..." nas ações e sucesso ao cancelar.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheck, FiCheckCircle, FiMapPin, FiXCircle } from 'react-icons/fi';
import EstadoVazio from '../../../components/EstadoVazio';
import Loading from '../../../components/Loading';
import MensagemErro from '../../../components/MensagemErro';
import { BOTAO_CONTORNO, BOTAO_EMERGENCIA, BOTAO_PRIMARIO } from '../../../components/celular/classes';
import PedirLogin from '../../../components/celular/PedirLogin';
import { useSimulador } from '../../../context/useSimulador';
import { useCarregar } from '../../../hooks/useCarregar';
import { fmtDiaHora } from '../../../lib/datas';
import { agora } from '../../../lib/relogio';
import { cancelarConsulta, confirmarConsulta, listarConsultas } from '../../../services/api';
import { BASE_CELULAR } from '../../../services/navegacao';
import { dispensadaConfirmacao, inicioPedidoConfirmacao, podeCancelar, prazoConfirmacao, precisaConfirmar } from '../../../services/regrasAgendamento';
import type { Consulta, StatusConsulta } from '../../../types';
import { mensagemDoErro } from '../../../utils/erros';

/** Nome de cada status para a pessoa. */
const ROTULO_STATUS: Record<StatusConsulta, string> = {
  AGENDADA: 'Agendada',
  CONFIRMADA: 'Confirmada',
  LIBERADA: 'Liberada para outra pessoa',
  REALIZADA: 'Realizada',
  FALTA: 'Falta',
};

interface CardConsultaProps {
  consulta: Consulta;
  onConfirmar: (c: Consulta) => void;
  onCancelar: (c: Consulta) => void;
  /** true enquanto uma ação está em andamento (desabilita os botões). */
  ocupado: boolean;
}

/** Card de uma consulta, com o prazo de confirmação e as ações permitidas agora. */
function CardConsulta({ consulta, onConfirmar, onCancelar, ocupado }: CardConsultaProps) {
  const [cancelando, setCancelando] = useState(false);
  const hoje = agora();
  const prazo = prazoConfirmacao(consulta);
  const inicio = inicioPedidoConfirmacao(consulta);
  const precisa = precisaConfirmar(consulta, hoje);

  return (
    <article className="flex flex-col gap-2 rounded-xl border border-borda bg-branco p-4 shadow-leve">
      <span className="w-fit rounded-full bg-mentaSuave px-2 py-0.5 text-xs font-bold text-primaria">{ROTULO_STATUS[consulta.dsStatus]}</span>
      <p className="flex items-center gap-2 font-bold"><FiMapPin className="shrink-0" aria-hidden />{consulta.nmUnidade}</p>
      <p className="font-semibold">{fmtDiaHora(consulta.dtHorario)}</p>

      {/* Regra: marcada com menos de 1 dia útil de antecedência não precisa confirmar */}
      {consulta.dsStatus === 'AGENDADA' && dispensadaConfirmacao(consulta) && (
        <p className="text-sm">Não precisa confirmar: consulta marcada com menos de 1 dia útil de antecedência.</p>
      )}
      {consulta.dsStatus === 'AGENDADA' && inicio && prazo && hoje < inicio && (
        <p className="text-sm">
          Vamos pedir a confirmação em {fmtDiaHora(inicio.toISOString(), false)}. Você terá até {fmtDiaHora(prazo.toISOString(), false)} para confirmar.
        </p>
      )}
      {precisa && prazo && (
        <>
          <p className="text-sm font-semibold text-primaria">Confirme sua presença até {fmtDiaHora(prazo.toISOString(), false)}.</p>
          <button type="button" onClick={() => onConfirmar(consulta)} disabled={ocupado} className={`${BOTAO_PRIMARIO} cursor-pointer disabled:opacity-60`}>
            <FiCheck aria-hidden /> {ocupado ? 'Aguarde...' : 'Confirmar presença'}
          </button>
        </>
      )}

      {podeCancelar(consulta, hoje) &&
        (cancelando ? (
          <div className="flex flex-col gap-2 rounded-xl border border-borda bg-fundo p-3" role="alertdialog" aria-label="Confirmar cancelamento">
            <p className="font-semibold">Tem certeza? O horário será liberado para outra pessoa.</p>
            <button type="button" onClick={() => onCancelar(consulta)} disabled={ocupado} className={`${BOTAO_EMERGENCIA} cursor-pointer disabled:opacity-60`}>
              {ocupado ? 'Cancelando...' : 'Sim, cancelar a consulta'}
            </button>
            <button type="button" onClick={() => setCancelando(false)} disabled={ocupado} className={`${BOTAO_CONTORNO} cursor-pointer`}>Voltar</button>
          </div>
        ) : (
          <button type="button" onClick={() => setCancelando(true)} disabled={ocupado} className={`${BOTAO_CONTORNO} cursor-pointer`}>
            <FiXCircle aria-hidden /> Não vou poder ir
          </button>
        ))}
    </article>
  );
}

/** Tela Minhas consultas. */
export default function Consultas() {
  const { estado } = useSimulador();
  const idCidadao = estado.idCidadaoAtual;
  const [ocupado, setOcupado] = useState(false);
  const [erroAcao, setErroAcao] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  // Só as consultas de quem está logado. TODO: aguardando a API Java devolver idCidadao no ConsultaSaidaDTO.
  const { dados, carregando, erro, recarregar } = useCarregar(
    async () => (await listarConsultas()).filter((c) => c.idCidadao === idCidadao),
    [idCidadao, estado.consultas],
  );

  if (idCidadao === null) return <PedirLogin mensagem="Entre para ver e confirmar suas consultas." />;
  if (carregando) return <Loading />;
  if (erro) return <MensagemErro mensagem={erro} onRetry={recarregar} />;

  /** Executa uma ação (confirmar ou cancelar) e busca a lista de novo. */
  const executar = async (acao: () => Promise<unknown>, mensagemSucesso: string | null) => {
    setOcupado(true);
    setErroAcao(null);
    setSucesso(null);
    try {
      await acao();
      setSucesso(mensagemSucesso);
      recarregar();
    } catch (e) {
      setErroAcao(mensagemDoErro(e));
    } finally {
      setOcupado(false);
    }
  };

  const lista = dados ?? [];
  const ativa = (c: Consulta) => c.dsStatus === 'AGENDADA' || c.dsStatus === 'CONFIRMADA';
  const proximas = lista.filter(ativa).sort((a, b) => a.dtHorario.localeCompare(b.dtHorario));
  const anteriores = lista.filter((c) => !ativa(c)).sort((a, b) => b.dtHorario.localeCompare(a.dtHorario));
  const card = (c: Consulta) => (
    <CardConsulta
      key={c.idConsulta}
      consulta={c}
      ocupado={ocupado}
      onConfirmar={(x) => void executar(() => confirmarConsulta(x, 'APP'), 'Presença confirmada. Obrigado!')}
      onCancelar={(x) => void executar(() => cancelarConsulta(x), 'Consulta cancelada. Obrigado por avisar: o horário vai para outra pessoa.')}
    />
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold text-primaria">Minhas consultas</h1>
      {sucesso && (
        <p className="flex items-start gap-2 rounded-xl bg-mentaSuave p-3 font-semibold text-primaria" role="status">
          <FiCheckCircle className="mt-1 shrink-0" aria-hidden /> {sucesso}
        </p>
      )}
      {erroAcao && <MensagemErro mensagem={erroAcao} />}
      {lista.length === 0 && (
        <>
          <EstadoVazio mensagem="Você ainda não tem consultas." />
          <Link to={`${BASE_CELULAR}/inicio`} className={BOTAO_PRIMARIO}>Iniciar uma orientação</Link>
        </>
      )}
      {proximas.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="font-extrabold">Próximas</h2>
          {proximas.map(card)}
        </section>
      )}
      {anteriores.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="font-extrabold">Anteriores</h2>
          {anteriores.map(card)}
        </section>
      )}
    </div>
  );
}
