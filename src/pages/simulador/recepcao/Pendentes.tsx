/**
 * Página: Pendentes (aba Recepção UBS → Pendentes, /simulador/recepcao/pendentes)
 * Consultas da UBS que precisam de confirmação: risco ALTO primeiro, com a pontuação de risco do Modelo 1,
 * o prazo e os contatos. A recepção registra "Confirmado por telefone", "Confirmado presencialmente"
 * ou "Cancelou por telefone".
 * Veio do protótipo: src/pages/recepcao/Pendentes.tsx.
 * Endpoints: GET /consultas, GET /unidades/{id}/horarios e PUT /consultas/{id}/status (API Java).
 * Estados: carregando, erro, vazio (nenhuma pendente), "Aguarde..." e erro das ações.
 * Regra: paciente sem celular e sem recado não tem a vaga liberada automaticamente (aparece com o aviso).
 */
import { useState } from 'react';
import { FiPhone, FiUserCheck, FiXCircle } from 'react-icons/fi';
import EstadoVazio from '../../../components/EstadoVazio';
import Loading from '../../../components/Loading';
import MensagemErro from '../../../components/MensagemErro';
import { BOTAO_CONTORNO, BOTAO_EMERGENCIA, BOTAO_PRIMARIO } from '../../../components/celular/classes';
import { useSimulador } from '../../../context/useSimulador';
import { useCarregar } from '../../../hooks/useCarregar';
import { fmtDiaHora } from '../../../lib/datas';
import { agora } from '../../../lib/relogio';
import { cancelarConsulta, confirmarConsulta, listarConsultas, listarHorarios } from '../../../services/api';
import { listarPendentesConfirmacao, prazoConfirmacao, prazoVencidoSemContato, temContatoValido } from '../../../services/regrasAgendamento';
import { mensagemDoErro } from '../../../utils/erros';
import { formatarPorcentagem, formatarTelefone } from '../../../utils/formatadores';

/** Tela Pendentes da recepção. */
export default function Pendentes() {
  const { estado } = useSimulador();
  const idUnidade = estado.idUnidadeRecepcao;
  const [enviando, setEnviando] = useState(false);
  const [erroAcao, setErroAcao] = useState<string | null>(null);
  const [cancelando, setCancelando] = useState<number | null>(null);

  const { dados, carregando, erro, recarregar } = useCarregar(async () => {
    const [consultas, horarios] = await Promise.all([listarConsultas(), listarHorarios(idUnidade)]);
    return { consultas, horarios };
  }, [idUnidade, estado.consultas]);

  if (carregando) return <Loading />;
  if (erro || !dados) return <MensagemErro mensagem={erro ?? 'Não foi possível carregar as pendentes.'} onRetry={recarregar} />;

  const hoje = agora();
  // Contatos: no modo demonstração vêm do mock. TODO: aguardando a API Java (busca do cadastro de cada paciente).
  const pendentes = listarPendentesConfirmacao(dados.consultas, dados.horarios, estado.cidadaos, idUnidade, hoje);

  /** Executa uma ação (confirmar ou cancelar) e atualiza a lista. */
  const executar = async (acao: () => Promise<unknown>) => {
    setEnviando(true);
    setErroAcao(null);
    try {
      await acao();
      setCancelando(null);
      recarregar();
    } catch (e) {
      setErroAcao(mensagemDoErro(e));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold text-primaria">Confirmações pendentes</h1>
      <p className="-mt-3 text-sm text-textoSuave">Risco alto primeiro: pontuação de risco de 0,60 ou mais.</p>
      {erroAcao && <MensagemErro mensagem={erroAcao} />}
      {pendentes.length === 0 && <EstadoVazio mensagem="Nenhuma consulta aguardando confirmação." />}

      <div className="grid gap-3 xl:grid-cols-2">
        {pendentes.map((c) => {
          const cidadao = estado.cidadaos.find((x) => x.idCidadao === c.idCidadao);
          const prazo = prazoConfirmacao(c);
          const semContato = cidadao ? !temContatoValido(cidadao) : true;
          const vencida = prazoVencidoSemContato(c, cidadao, hoje);
          return (
            <article key={c.idConsulta} className="flex flex-col gap-2 rounded-xl border border-borda bg-branco p-4 shadow-leve">
              <div className="flex items-center justify-between gap-2">
                <p className="font-extrabold">{c.nmCidadao || cidadao?.nmCidadao || 'Paciente'}</p>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${c.dsRiscoFalta === 'ALTO' ? 'bg-primaria text-branco' : 'bg-mentaSuave text-primaria'}`}>
                  Risco {c.dsRiscoFalta ?? '—'}{c.vlProbFalta != null ? ` · ${formatarPorcentagem(c.vlProbFalta)}` : ''}
                </span>
              </div>
              <p className="font-semibold">{fmtDiaHora(c.dtHorario)}</p>
              {vencida ? (
                <p className="rounded-xl bg-primariaEscura p-2 text-sm font-extrabold text-branco" role="status">Prazo vencido – sem contato</p>
              ) : (
                prazo && <p className="text-sm font-semibold text-primaria">Prazo para confirmar: {fmtDiaHora(prazo.toISOString(), false)}</p>
              )}
              {cidadao?.nrCelular && <p className="text-sm">Celular: {formatarTelefone(cidadao.nrCelular)}</p>}
              {cidadao?.nmContatoRecado && (
                <p className="text-sm">Recado: {cidadao.nmContatoRecado} · {formatarTelefone(cidadao.nrContatoRecado)}</p>
              )}
              {semContato && !vencida && (
                <p className="rounded-xl bg-mentaSuave p-2 text-sm font-bold text-primaria">Sem contato: a vaga não é liberada automaticamente</p>
              )}
              <div className="grid gap-2">
                <button type="button" disabled={enviando} onClick={() => void executar(() => confirmarConsulta(c, 'TELEFONE'))}
                  className={`${BOTAO_PRIMARIO} cursor-pointer disabled:opacity-60`}>
                  <FiPhone aria-hidden /> Confirmado por telefone
                </button>
                <button type="button" disabled={enviando} onClick={() => void executar(() => confirmarConsulta(c, 'PRESENCIAL'))}
                  className={`${BOTAO_CONTORNO} cursor-pointer disabled:opacity-60`}>
                  <FiUserCheck aria-hidden /> Confirmado presencialmente
                </button>
                {cancelando === c.idConsulta ? (
                  <div className="flex flex-col gap-2 rounded-xl border border-borda bg-fundo p-3" role="alertdialog" aria-label="Confirmar cancelamento">
                    <p className="font-semibold">Confirmar cancelamento? O horário será liberado para outra pessoa.</p>
                    <button type="button" disabled={enviando} onClick={() => void executar(() => cancelarConsulta(c))}
                      className={`${BOTAO_EMERGENCIA} cursor-pointer disabled:opacity-60`}>
                      Sim, cancelar a consulta
                    </button>
                    <button type="button" disabled={enviando} onClick={() => setCancelando(null)} className={`${BOTAO_CONTORNO} cursor-pointer`}>Voltar</button>
                  </div>
                ) : (
                  <button type="button" disabled={enviando} onClick={() => setCancelando(c.idConsulta)} className={`${BOTAO_CONTORNO} cursor-pointer`}>
                    <FiXCircle aria-hidden /> Cancelou por telefone
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
