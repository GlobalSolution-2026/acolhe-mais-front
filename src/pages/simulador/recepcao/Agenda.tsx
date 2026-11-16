/**
 * Página: Agenda do dia (aba Recepção UBS → Agenda, /simulador/recepcao/agenda)
 * Horários da UBS no dia escolhido, com o paciente, o status, o risco de falta (Modelo 1) e o selo de
 * quem fez orientação hoje. Registra presença e falta, e agenda na hora para quem chegou sem celular.
 * Veio do protótipo: src/pages/recepcao/Agenda.tsx.
 * Endpoints: GET /unidades/{id}/horarios, GET /consultas, PUT /consultas/{id}/status,
 * GET /cidadaos?cns=, POST /cidadaos e POST /consultas (API Java) + POST /prever-falta (API Flask).
 * Estados: carregando, erro, vazio (nenhum horário no dia), "Aguarde..." nas ações e erro das ações.
 */
import { useState } from 'react';
import { FiUserPlus } from 'react-icons/fi';
import EstadoVazio from '../../../components/EstadoVazio';
import Loading from '../../../components/Loading';
import MensagemErro from '../../../components/MensagemErro';
import { BOTAO_CONTORNO, BOTAO_PRIMARIO } from '../../../components/celular/classes';
import FormularioCidadao, { type DadosCidadao } from '../../../components/celular/FormularioCidadao';
import SeloOrientacaoHoje from '../../../components/recepcao/SeloOrientacaoHoje';
import { useSimulador } from '../../../context/useSimulador';
import { useCarregar } from '../../../hooks/useCarregar';
import { chaveDia, fmtHora, listarDiasUnidade, rotuloDia } from '../../../lib/datas';
import { agora } from '../../../lib/relogio';
import { agendarConsulta, buscarCidadaoPorCns, cadastrarCidadao, listarConsultas, listarHorarios, registrarPresenca } from '../../../services/api';
import { acoesPresenca, orientacaoDoDia } from '../../../services/regrasAgendamento';
import type { Consulta, Horario, StatusConsulta } from '../../../types';
import { mensagemDoErro } from '../../../utils/erros';
import { formatarPorcentagem } from '../../../utils/formatadores';

const ROTULO_STATUS: Record<StatusConsulta, string> = {
  AGENDADA: 'Agendada',
  CONFIRMADA: 'Confirmada',
  LIBERADA: 'Liberada',
  REALIZADA: 'Realizada',
  FALTA: 'Falta',
};

/** Tela Agenda do dia da recepção. */
export default function Agenda() {
  const { estado } = useSimulador();
  const idUnidade = estado.idUnidadeRecepcao;
  const unidade = estado.unidades.find((u) => u.idUnidade === idUnidade);
  const [diaEscolhido, setDiaEscolhido] = useState<string | null>(null);
  const [formAberto, setFormAberto] = useState<number | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [erroAcao, setErroAcao] = useState<string | null>(null);

  // Horários da UBS + consultas; no modo demonstração, busca de novo quando o mock muda.
  const { dados, carregando, erro, recarregar } = useCarregar(async () => {
    const [horarios, consultas] = await Promise.all([listarHorarios(idUnidade), listarConsultas()]);
    return { horarios, consultas };
  }, [idUnidade, estado.horarios, estado.consultas]);

  if (carregando) return <Loading />;
  if (erro || !dados) return <MensagemErro mensagem={erro ?? 'Não foi possível carregar a agenda.'} onRetry={recarregar} />;

  const hoje = chaveDia(agora().toISOString());
  const dias = listarDiasUnidade(dados.horarios, idUnidade);
  // Sem escolha, abre no dia de hoje (ou no próximo dia com atendimento).
  const dia = diaEscolhido ?? dias.find((d) => d >= hoje) ?? dias[dias.length - 1] ?? '';
  const horariosDia = dados.horarios.filter((h) => chaveDia(h.dtHorario) === dia).sort((a, b) => a.dtHorario.localeCompare(b.dtHorario));

  // TODO: aguardando a API Java devolver idHorario na consulta (sem ele, a agenda real não liga horário e paciente).
  const consultaDoHorario = (h: Horario) =>
    dados.consultas.find((c) => c.idHorario === h.idHorario && c.dsStatus !== 'LIBERADA') ??
    dados.consultas.find((c) => c.idHorario === h.idHorario);

  /** Executa uma ação da agenda mostrando o erro na tela, se houver. */
  const executar = async (acao: () => Promise<unknown>) => {
    setEnviando(true);
    setErroAcao(null);
    try {
      await acao();
      recarregar();
      return true;
    } catch (e) {
      setErroAcao(mensagemDoErro(e));
      return false;
    } finally {
      setEnviando(false);
    }
  };

  /** Quem chegou sem horário: usa o cadastro pelo CNS (ou cadastra no balcão, sem senha) e agenda. */
  const agendarParaQuemChegou = async (horario: Horario, form: DadosCidadao) => {
    const ok = await executar(async () => {
      const cidadao = (await buscarCidadaoPorCns(form.nrCns)) ?? (await cadastrarCidadao(form));
      await agendarConsulta({ horario, cidadao, idOrientacao: null });
    });
    if (ok) setFormAberto(null);
  };

  const risco = (c: Consulta) =>
    c.dsRiscoFalta ? `Risco de falta: ${c.dsRiscoFalta}${c.vlProbFalta != null ? ` (${formatarPorcentagem(c.vlProbFalta)})` : ''}` : null;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold text-primaria">Agenda — {unidade?.nmUnidade}</h1>
      <p className="-mt-3 text-sm text-textoSuave">Risco alto: probabilidade de falta de 60% ou mais.</p>
      <div className="flex flex-col gap-1 md:w-80">
        <label htmlFor="diaAgenda" className="font-semibold">Dia</label>
        <select
          id="diaAgenda"
          value={dia}
          onChange={(e) => setDiaEscolhido(e.target.value)}
          className="min-h-12 rounded-xl border border-borda bg-branco px-4 outline-none focus:ring-2 focus:ring-primaria"
        >
          {dias.map((d) => {
            const h = dados.horarios.find((x) => chaveDia(x.dtHorario) === d);
            return <option key={d} value={d}>{h ? rotuloDia(h.dtHorario, false, agora()) : d}</option>;
          })}
        </select>
      </div>
      {erroAcao && <MensagemErro mensagem={erroAcao} />}
      {horariosDia.length === 0 && <EstadoVazio mensagem="Nenhum horário neste dia." />}

      <div className="grid gap-3 xl:grid-cols-2">
        {horariosDia.map((h) => {
          const consulta = consultaDoHorario(h);
          const ativa = consulta && (consulta.dsStatus === 'AGENDADA' || consulta.dsStatus === 'CONFIRMADA');
          // Lembrete para quem vai atender: a pessoa procurou ajuda pelo app hoje.
          const orientacao = ativa && chaveDia(consulta.dtHorario) === hoje
            ? orientacaoDoDia(estado.orientacoes, estado.listaDoDia, consulta.idCidadao ?? null, hoje)
            : undefined;
          // Regra: presença só no dia da consulta; falta só depois do horário.
          const pode = consulta ? acoesPresenca(consulta, agora()) : { presenca: false, falta: false };
          const livreFuturo = !consulta || consulta.dsStatus === 'LIBERADA' ? !h.flOcupado && new Date(h.dtHorario).getTime() > agora().getTime() : false;

          return (
            <article key={h.idHorario} className="flex flex-col gap-2 rounded-xl border border-borda bg-branco p-4 shadow-leve">
              <div className="flex items-center justify-between gap-2">
                <p className="text-lg font-extrabold">{fmtHora(h.dtHorario)}</p>
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${consulta ? 'bg-mentaSuave text-primaria' : 'bg-fundo text-textoSuave'}`}>
                  {consulta ? ROTULO_STATUS[consulta.dsStatus] : 'Livre'}
                </span>
              </div>
              {consulta && (
                <>
                  <p className="font-bold">{consulta.nmCidadao || 'Paciente'}</p>
                  {orientacao && <SeloOrientacaoHoje orientacao={orientacao} hoje={hoje} />}
                  {risco(consulta) && (
                    <p className={`text-sm font-bold ${consulta.dsRiscoFalta === 'ALTO' ? 'text-primaria' : 'text-textoSuave'}`}>{risco(consulta)}</p>
                  )}
                  {(pode.presenca || pode.falta) && (
                    <div className={`grid gap-2 ${pode.presenca && pode.falta ? 'grid-cols-2' : 'grid-cols-1'}`}>
                      {pode.presenca && (
                        <button type="button" disabled={enviando} onClick={() => void executar(() => registrarPresenca(consulta, 'REALIZADA'))}
                          className={`${BOTAO_PRIMARIO} cursor-pointer disabled:opacity-60`}>
                          Registrar presença
                        </button>
                      )}
                      {pode.falta && (
                        <button type="button" disabled={enviando} onClick={() => void executar(() => registrarPresenca(consulta, 'FALTA'))}
                          className={`${BOTAO_CONTORNO} cursor-pointer disabled:opacity-60`}>
                          Registrar falta
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
              {livreFuturo &&
                (formAberto === h.idHorario ? (
                  <div className="flex flex-col gap-3 border-t border-borda pt-3">
                    <p className="font-bold">Agendar para quem chegou</p>
                    <FormularioCidadao
                      nrCep={unidade?.nrCep ?? ''}
                      celularOpcional
                      aoEnviar={(d) => void agendarParaQuemChegou(h, d)}
                      textoBotao="Agendar"
                      textoEnviando="Agendando..."
                      enviando={enviando}
                    />
                    <button type="button" onClick={() => setFormAberto(null)} className={`${BOTAO_CONTORNO} cursor-pointer`}>Cancelar</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => setFormAberto(h.idHorario)} className={`${BOTAO_CONTORNO} cursor-pointer`}>
                    <FiUserPlus aria-hidden /> Agendar para quem chegou
                  </button>
                ))}
            </article>
          );
        })}
      </div>
    </div>
  );
}
