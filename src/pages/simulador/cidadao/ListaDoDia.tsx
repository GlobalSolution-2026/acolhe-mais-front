/**
 * Página: Lista do dia (aba Cidadão → celular, /simulador/cidadao/lista-do-dia)
 * Mostra a posição da pessoa na fila da lista do dia da UBS (quem foi sem horário e espera uma vaga liberada).
 * Veio do protótipo: src/pages/cidadao/ListaDoDiaCidadao.tsx.
 * Endpoints: nenhum. DEMONSTRAÇÃO: a lista do dia não existe na API Java.
 * Estados: fora da lista (vazio), sem login (pede para entrar e receber a vaga no nome) e já com consulta hoje.
 * Regras: quem ficou de ontem tem prioridade; depois verde antes de azul; depois ordem de chegada.
 */
import { Link } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';
import EstadoVazio from '../../../components/EstadoVazio';
import SeloDemonstracao from '../../../components/SeloDemonstracao';
import { BOTAO_CONTORNO, BOTAO_PRIMARIO } from '../../../components/celular/classes';
import { useSimulador } from '../../../context/useSimulador';
import { chaveDia, fmtHora } from '../../../lib/datas';
import { agora } from '../../../lib/relogio';
import { BASE_CELULAR, queryRetorno } from '../../../services/navegacao';
import { consultaNoDia, entradaDoCidadao, posicaoNaFila } from '../../../services/regrasAgendamento';

/** Tela Lista do dia do cidadão. */
export default function ListaDoDia() {
  const { estado } = useSimulador();
  // Regra: a entrada é buscada pela conta logada (nunca a de outra pessoa que usou o app).
  const minha = entradaDoCidadao(estado.listaDoDia, estado.idCidadaoAtual);

  if (!minha) {
    return (
      <div className="flex flex-col gap-4">
        <EstadoVazio mensagem="Você não está na lista do dia de nenhuma UBS." />
        <Link to={`${BASE_CELULAR}/inicio`} className={BOTAO_PRIMARIO}>Voltar ao início</Link>
      </div>
    );
  }

  const fila = estado.listaDoDia.filter((e) => e.idUnidade === minha.idUnidade);
  const posicao = posicaoNaFila(fila, minha.idEntrada);
  const unidade = estado.unidades.find((u) => u.idUnidade === minha.idUnidade);
  const consultaHoje = consultaNoDia(estado.consultas, minha.idCidadao, chaveDia(agora().toISOString()));
  const query = queryRetorno({ destino: 'lista-do-dia' });

  return (
    <div className="flex flex-col gap-4">
      <SeloDemonstracao descricao="A lista do dia ainda não existe na API Java." />
      <h1 className="text-2xl font-extrabold text-primaria">Lista do dia</h1>
      <div className="flex flex-col items-center gap-1 rounded-xl border border-borda bg-branco p-6 text-center shadow-leve">
        <p className="text-base text-textoSuave">Sua posição na fila da {unidade?.nmUnidade ?? 'UBS'}</p>
        <p className="text-5xl font-extrabold text-primaria">{posicao}º</p>
        {minha.flPrioridade && <p className="font-semibold text-textoSuave">Você tem prioridade por ter ficado de ontem.</p>}
      </div>
      {consultaHoje && (
        <p className="rounded-xl border border-borda bg-branco p-3 font-semibold" role="status">
          Você já tem consulta hoje às {fmtHora(consultaHoje.dtHorario)}. Sua orientação fica registrada para a equipe da UBS.
        </p>
      )}
      {estado.idCidadaoAtual === null && (
        <section className="flex flex-col gap-3 rounded-xl border border-borda bg-branco p-4">
          <p className="font-semibold">Entre ou crie sua conta para receber a vaga no seu nome.</p>
          <Link to={`${BASE_CELULAR}/entrar${query}`} className={BOTAO_PRIMARIO}>Entrar</Link>
          <Link to={`${BASE_CELULAR}/criar-conta${query}`} className={BOTAO_CONTORNO}>Criar conta</Link>
        </section>
      )}
      <p className="flex items-start gap-2 rounded-xl bg-mentaSuave p-3 font-semibold">
        <FiAlertTriangle className="mt-1 shrink-0" aria-hidden /> Se piorar, ligue 192 ou procure a UPA.
      </p>
      <Link to={`${BASE_CELULAR}/avisos`} className={BOTAO_CONTORNO}>Ver meus avisos</Link>
    </div>
  );
}
