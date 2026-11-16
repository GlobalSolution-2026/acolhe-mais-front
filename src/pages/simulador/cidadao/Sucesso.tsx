/**
 * Página: Consulta agendada (aba Cidadão → celular, /simulador/cidadao/sucesso?consulta=)
 * Confirma o agendamento com UBS, data e hora e explica quando a confirmação será pedida.
 * Veio do protótipo: src/pages/cidadao/Sucesso.tsx.
 * Endpoints: nenhum (a consulta vem da tela Agendar; no modo demonstração, também do mock).
 * Estados: consulta não encontrada (vazio).
 * Regras de confirmação (só dias úteis): risco BAIXO → pedido 2 dias úteis antes; ALTO → 3 dias úteis antes,
 * com lembrete; prazo final 1 dia útil antes; marcada com menos de 1 dia útil, não precisa confirmar.
 */
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { FiCalendar, FiCheckCircle } from 'react-icons/fi';
import EstadoVazio from '../../../components/EstadoVazio';
import { BOTAO_PRIMARIO } from '../../../components/celular/classes';
import { useSimulador } from '../../../context/useSimulador';
import { fmtDiaHora } from '../../../lib/datas';
import { BASE_CELULAR } from '../../../services/navegacao';
import { dispensadaConfirmacao } from '../../../services/regrasAgendamento';
import type { Consulta } from '../../../types';

/** Texto que explica quando a confirmação será pedida, conforme o risco de falta. */
function explicacaoConfirmacao(consulta: Consulta): string {
  if (dispensadaConfirmacao(consulta)) {
    return 'Como a consulta foi marcada com menos de 1 dia útil de antecedência, você não precisa confirmar.';
  }
  return consulta.dsRiscoFalta === 'ALTO'
    ? 'Vamos pedir a confirmação 3 dias úteis antes, com um lembrete adicional. Confirme até 1 dia útil antes da consulta, senão a vaga é oferecida a outra pessoa.'
    : 'Vamos pedir a confirmação 2 dias úteis antes. Confirme até 1 dia útil antes da consulta, senão a vaga é oferecida a outra pessoa.';
}

/** Tela de sucesso do agendamento. */
export default function Sucesso() {
  const { estado } = useSimulador();
  const { state } = useLocation();
  const [parametros] = useSearchParams();
  const idConsulta = Number(parametros.get('consulta'));
  const consulta: Consulta | undefined =
    (state as { consulta?: Consulta } | null)?.consulta ?? estado.consultas.find((c) => c.idConsulta === idConsulta);

  if (!consulta) {
    return (
      <div className="flex flex-col gap-4">
        <EstadoVazio mensagem="Consulta não encontrada." />
        <Link to={`${BASE_CELULAR}/inicio`} className={BOTAO_PRIMARIO}>Voltar ao início</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-2 rounded-xl bg-mentaSuave p-6 text-center">
        <FiCheckCircle size={40} className="text-primaria" aria-hidden />
        <h1 className="text-2xl font-extrabold text-primaria">Consulta marcada!</h1>
      </div>
      <section className="rounded-xl border border-borda bg-branco p-4 shadow-leve">
        <p className="text-lg font-extrabold">{consulta.nmUnidade}</p>
        <p className="font-semibold">{fmtDiaHora(consulta.dtHorario)}</p>
      </section>
      <p className="rounded-xl border border-borda bg-branco p-4">{explicacaoConfirmacao(consulta)}</p>
      <Link to={`${BASE_CELULAR}/consultas`} className={BOTAO_PRIMARIO}>
        <FiCalendar aria-hidden /> Ver minhas consultas
      </Link>
    </div>
  );
}
