/**
 * Página: Indicadores (aba Recepção UBS → Indicadores, /simulador/recepcao/indicadores)
 * Indicadores da UBS (Tabela 5 do texto): taxa de absenteísmo, reaproveitamento de horários,
 * pessoas não encaixadas na lista do dia, tempo médio até a consulta e comparecimento após orientação.
 * Veio do protótipo: src/pages/recepcao/Indicadores.tsx ("tempo até a consulta" foi acrescentado).
 * Endpoints: GET /consultas e GET /unidades/{id}/horarios (API Java). Lista do dia: demonstração.
 * Estados: carregando, erro e "—" quando ainda não há dados para o indicador.
 */
import Loading from '../../../components/Loading';
import MensagemErro from '../../../components/MensagemErro';
import { useSimulador } from '../../../context/useSimulador';
import { useCarregar } from '../../../hooks/useCarregar';
import { agora } from '../../../lib/relogio';
import { listarConsultas, listarHorarios } from '../../../services/api';
import { calcularIndicadores, tempoMedioAteConsulta } from '../../../services/regrasAgendamento';

/** Card de um indicador: nome, valor grande e a explicação de como é calculado. */
function Card({ titulo, valor, explicacao }: { titulo: string; valor: string; explicacao: string }) {
  return (
    <article className="flex flex-col gap-1 rounded-xl border border-borda bg-branco p-4 shadow-leve">
      <p className="text-sm font-semibold text-textoSuave">{titulo}</p>
      <p className="text-3xl font-extrabold text-primaria">{valor}</p>
      <p className="text-sm text-textoSuave">{explicacao}</p>
    </article>
  );
}

/** Porcentagem ou "—" quando ainda não dá para calcular. */
const pct = (v: number | null) => (v === null ? '—' : `${Math.round(v * 100)}%`);

/** Tela Indicadores da recepção. */
export default function Indicadores() {
  const { estado } = useSimulador();
  const idUnidade = estado.idUnidadeRecepcao;
  const { dados, carregando, erro, recarregar } = useCarregar(async () => {
    const [consultas, horarios] = await Promise.all([listarConsultas(), listarHorarios(idUnidade)]);
    // Só as consultas dos horários desta UBS.
    const ids = new Set(horarios.map((h) => h.idHorario));
    return consultas.filter((c) => c.idHorario !== undefined && ids.has(c.idHorario));
  }, [idUnidade, estado.consultas]);

  if (carregando) return <Loading />;
  if (erro || !dados) return <MensagemErro mensagem={erro ?? 'Não foi possível calcular os indicadores.'} onRetry={recarregar} />;

  const lista = estado.listaDoDia.filter((e) => e.idUnidade === idUnidade);
  const i = calcularIndicadores(dados, lista, agora());
  const tempo = tempoMedioAteConsulta(dados);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold text-primaria">Indicadores</h1>
      <div className="grid gap-3 md:grid-cols-2">
        <Card titulo="Taxa de absenteísmo" valor={pct(i.taxaAbsenteismo)} explicacao="Faltas entre as consultas que já aconteceram." />
        <Card titulo="Reaproveitamento de horários" valor={pct(i.taxaReaproveitamento)}
          explicacao="Horários liberados que foram ocupados de novo, divididos pelos horários liberados." />
        <Card titulo="Não encaixados hoje" valor={String(i.naoEncaixadas)} explicacao="Pessoas ainda aguardando uma vaga na lista do dia." />
        <Card titulo="Tempo até a consulta" valor={tempo === null ? '—' : `${tempo.toLocaleString('pt-BR')} dias`}
          explicacao="Média de dias entre o agendamento e a data da consulta." />
        <Card titulo="Comparecimento após orientação" valor={pct(i.comparecimentoAposOrientacao)}
          explicacao="Consultas realizadas entre as que vieram de uma orientação do app e já aconteceram." />
      </div>
    </div>
  );
}
