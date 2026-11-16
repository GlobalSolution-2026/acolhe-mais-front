/**
 * Página: aba IA – Risco de falta (/simulador/ia-risco-falta)
 * Tela de "admin" do Modelo 1: formulário com os atributos do modelo (idade, sexo, antecedência, dia da
 * semana, SMS recebido e faltas anteriores) ou "Sortear consulta da agenda" (preenche com uma consulta do mock).
 * Mostra a probabilidade (barra), o risco pelo limiar de 0,60, a consequência na solução e, para consulta
 * que já aconteceu (REALIZADA ou FALTA), se o modelo acertou.
 * Veio de: planejamento do grupo (não há tela equivalente no protótipo).
 * Endpoints: POST /prever-falta (API Flask).
 * Estados: enviando ("Calculando..."), erro da API (400 sem campo, fora do ar) e sem resultado ainda.
 */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiCheckCircle, FiShuffle, FiXCircle } from 'react-icons/fi';
import BarraProbabilidade from '../../../components/ia/BarraProbabilidade';
import CampoFormulario from '../../../components/CampoFormulario';
import LayoutAba from '../../../components/LayoutAba';
import MensagemErro from '../../../components/MensagemErro';
import PainelExplicacao from '../../../components/PainelExplicacao';
import SeloDemonstracao from '../../../components/SeloDemonstracao';
import { useSimulador } from '../../../context/useSimulador';
import { LIMIAR_RISCO_ALTO } from '../../../data/configuracoes';
import { fmtDiaHora } from '../../../lib/datas';
import { FLASK_URL, montarEntradaPrevisao, preverFalta } from '../../../services/ia';
import type { Consulta, PrevisaoFalta, PrevisaoFaltaEntrada } from '../../../types';
import { mensagemDoErro } from '../../../utils/erros';
import { formatarPorcentagem } from '../../../utils/formatadores';

/** Campos do formulário (texto, como no input). */
interface FormRisco {
  idade: string;
  sexo: '' | 'F' | 'M';
  antecedenciaDias: string;
  diaSemana: string;
  smsRecebido: boolean;
  faltasAnteriores: string;
}

const DIAS = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const SELECT = 'min-h-12 w-full rounded-xl border border-borda bg-branco px-4 text-texto outline-none focus:ring-2 focus:ring-primaria';
const BOTAO_PRIMARIO =
  'flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primaria px-5 font-bold text-branco shadow-leve hover:bg-primariaEscura disabled:cursor-not-allowed disabled:opacity-60';
const BOTAO_CONTORNO =
  'flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-borda bg-branco px-5 font-bold text-primaria shadow-leve hover:bg-mentaSuave';

/** Número inteiro dentro de um intervalo (regras do react-hook-form). */
const inteiro = (min: number, max: number, nome: string) => ({
  required: `Informe ${nome}.`,
  pattern: { value: /^\d+$/, message: 'Use só números inteiros.' },
  validate: (v: string) => (Number(v) >= min && Number(v) <= max) || `Use um valor de ${min} a ${max}.`,
});

/** Aba IA – Risco de falta (Modelo 1). */
export default function AbaIaRiscoFalta() {
  const { estado } = useSimulador();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormRisco>({
    defaultValues: { idade: '', sexo: '', antecedenciaDias: '', diaSemana: '1', smsRecebido: false, faltasAnteriores: '0' },
  });
  const [resultado, setResultado] = useState<PrevisaoFalta | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  // Consulta sorteada (para dizer se o modelo acertou, quando ela já aconteceu).
  const [sorteada, setSorteada] = useState<Consulta | null>(null);

  /** Sorteia uma consulta da agenda do mock e preenche o formulário com os dados do momento do agendamento. */
  const sortear = () => {
    const candidatas = estado.consultas.filter((c) => c.dtAgendamento && c.idCidadao && c.idHorario && c.dsStatus !== 'LIBERADA');
    const consulta = candidatas[Math.floor(Math.random() * candidatas.length)];
    const cidadao = estado.cidadaos.find((p) => p.idCidadao === consulta?.idCidadao);
    const horario = estado.horarios.find((h) => h.idHorario === consulta?.idHorario);
    if (!consulta || !cidadao || !horario) return;
    // Os atributos são os do dia em que a consulta foi marcada (é quando o modelo roda na solução).
    const e = montarEntradaPrevisao(horario, cidadao, estado.consultas, new Date(consulta.dtAgendamento ?? consulta.dtHorario));
    reset({
      idade: String(e.idade), sexo: e.sexo, antecedenciaDias: String(e.antecedenciaDias), diaSemana: String(e.diaSemana),
      smsRecebido: e.smsRecebido, faltasAnteriores: String(e.faltasAnteriores),
    });
    setSorteada(consulta);
    setResultado(null);
    setErro(null);
  };

  /** Chama o Modelo 1 com os dados do formulário. */
  const enviar = handleSubmit(async (v) => {
    setErro(null);
    const entrada: PrevisaoFaltaEntrada = {
      idade: Number(v.idade),
      sexo: v.sexo as 'F' | 'M',
      antecedenciaDias: Number(v.antecedenciaDias),
      diaSemana: Number(v.diaSemana),
      smsRecebido: v.smsRecebido,
      faltasAnteriores: Number(v.faltasAnteriores),
    };
    try {
      setResultado(await preverFalta(entrada));
    } catch (e) {
      setErro(mensagemDoErro(e));
    }
  });

  // Regra: o modelo "acerta" quando prevê ALTO e a pessoa faltou, ou BAIXO e a pessoa foi.
  const aconteceu = sorteada && (sorteada.dsStatus === 'REALIZADA' || sorteada.dsStatus === 'FALTA');
  const acertou = resultado && aconteceu
    ? (resultado.dsRiscoFalta === 'ALTO') === (sorteada.dsStatus === 'FALTA')
    : null;

  return (
    <LayoutAba
      explicacao={
        <PainelExplicacao
          titulo="IA – Risco de falta (Modelo 1)"
          oQueFaz="Estima a probabilidade de a pessoa faltar à consulta. Na solução, roda no momento do agendamento e define quando a UBS pede a confirmação de presença."
          regras={[
            'Base: Medical Appointment No Shows (Kaggle), 110.527 consultas de Vitória-ES.',
            'Colunas clínicas e Bolsa Família ficaram fora do modelo, por coerência com a LGPD (dado sensível que o app não precisa).',
            'Base desbalanceada (cerca de 20% de faltas): por isso as métricas vão além da acurácia (recall, F1 e ROC-AUC).',
            'Risco ALTO a partir de 0,60: pedido de confirmação 3 dias úteis antes, com lembrete. BAIXO: 2 dias úteis antes.',
            'Limitações desta versão: smsRecebido vai sempre false no agendamento (o lembrete ainda não foi enviado) e o bairro não é enviado (a API usa "OUTROS"). Ideia futura: um modelo por unidade.',
          ]}
          endpoints={[{ metodo: 'POST', rota: '/prever-falta', api: 'FLASK' }]}
        />
      }
    >
      <div className="flex flex-col gap-4">
        <section className="flex flex-col gap-1 rounded-xl border border-borda bg-branco p-4 shadow-leve">
          <h1 className="text-2xl font-extrabold text-primaria">IA – Risco de falta</h1>
          <p className="text-textoSuave">Preencha os atributos do Modelo 1 ou sorteie uma consulta da agenda da demonstração.</p>
          {!FLASK_URL && <SeloDemonstracao descricao="Sem a URL da API Flask, a previsão usa a simulação do protótipo." />}
        </section>

        <form onSubmit={enviar} noValidate className="flex flex-col gap-4 rounded-xl border border-borda bg-branco p-4 shadow-leve">
          <div className="grid gap-4 md:grid-cols-2">
            <CampoFormulario id="idadeIa" label="Idade" numerico erro={errors.idade} registro={register('idade', inteiro(0, 120, 'a idade'))} />
            <div className="flex flex-col gap-1">
              <label htmlFor="sexoIa" className="font-semibold">Sexo</label>
              <select id="sexoIa" className={SELECT} aria-invalid={!!errors.sexo} {...register('sexo', { required: 'Informe o sexo.' })}>
                <option value="">Selecione</option>
                <option value="F">Feminino</option>
                <option value="M">Masculino</option>
              </select>
              {errors.sexo && <p className="text-sm font-semibold text-gravidade-vermelho">{errors.sexo.message}</p>}
            </div>
            <CampoFormulario id="antecedenciaIa" label="Antecedência (dias entre agendar e a consulta)" numerico erro={errors.antecedenciaDias}
              registro={register('antecedenciaDias', inteiro(0, 365, 'a antecedência'))} />
            <div className="flex flex-col gap-1">
              <label htmlFor="diaSemanaIa" className="font-semibold">Dia da semana da consulta</label>
              <select id="diaSemanaIa" className={SELECT} {...register('diaSemana')}>
                {DIAS.map((d, i) => <option key={d} value={i}>{d}</option>)}
              </select>
            </div>
            <CampoFormulario id="faltasIa" label="Faltas anteriores" numerico erro={errors.faltasAnteriores}
              registro={register('faltasAnteriores', inteiro(0, 50, 'as faltas anteriores'))} />
            <label className="flex min-h-12 items-center gap-3 self-end font-semibold">
              <input type="checkbox" className="h-5 w-5 accent-primaria" {...register('smsRecebido')} />
              SMS de lembrete recebido
            </label>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <button type="button" onClick={sortear} className={BOTAO_CONTORNO}>
              <FiShuffle aria-hidden /> Sortear consulta da agenda
            </button>
            <button type="submit" disabled={isSubmitting} className={BOTAO_PRIMARIO}>
              {isSubmitting ? 'Calculando...' : 'Calcular risco'}
            </button>
          </div>
          {sorteada && (
            <p className="text-sm text-textoSuave">
              Consulta sorteada: {sorteada.nmCidadao} · {sorteada.nmUnidade} · {fmtDiaHora(sorteada.dtHorario, false)} · status {sorteada.dsStatus}
            </p>
          )}
        </form>

        {erro && <MensagemErro mensagem={erro} />}

        {resultado && (
          <section className="flex flex-col gap-4 rounded-xl border border-borda bg-branco p-4 shadow-leve" aria-live="polite">
            <BarraProbabilidade valor={resultado.vlProbFalta} limiar={LIMIAR_RISCO_ALTO} rotuloLimiar="Limiar de risco ALTO" rotulo="Probabilidade de falta" />
            <p className="flex flex-wrap items-center gap-2 text-lg font-extrabold">
              Risco:
              <span className={`rounded-full px-3 py-1 ${resultado.dsRiscoFalta === 'ALTO' ? 'bg-primaria text-branco' : 'bg-mentaSuave text-primaria'}`}>
                {resultado.dsRiscoFalta}
              </span>
            </p>
            <div className="rounded-xl bg-mentaSuave p-3">
              <p className="font-bold text-primaria">Consequência na solução</p>
              <p>
                {resultado.dsRiscoFalta === 'ALTO'
                  ? 'A UBS pede a confirmação 3 dias úteis antes, com um lembrete extra. Na recepção, a consulta aparece primeiro na lista de pendentes.'
                  : 'A UBS pede a confirmação 2 dias úteis antes.'}{' '}
                O prazo final é 1 dia útil antes; quem não confirma tem o horário liberado para a lista do dia.
              </p>
            </div>
            {acertou !== null && sorteada && (
              <p className={`flex items-start gap-2 rounded-xl border-2 p-3 font-semibold ${acertou ? 'border-menta' : 'border-primaria'}`} role="status">
                {acertou ? <FiCheckCircle className="mt-1 shrink-0" aria-hidden /> : <FiXCircle className="mt-1 shrink-0" aria-hidden />}
                {acertou ? 'O modelo acertou' : 'O modelo errou'}: previu risco {resultado.dsRiscoFalta} ({formatarPorcentagem(resultado.vlProbFalta)}) e a pessoa{' '}
                {sorteada.dsStatus === 'FALTA' ? 'faltou' : 'compareceu'}.
              </p>
            )}
            {sorteada && !aconteceu && (
              <p className="text-sm text-textoSuave">Esta consulta ainda não aconteceu: não dá para saber se o modelo acertou.</p>
            )}
          </section>
        )}
      </div>
    </LayoutAba>
  );
}
