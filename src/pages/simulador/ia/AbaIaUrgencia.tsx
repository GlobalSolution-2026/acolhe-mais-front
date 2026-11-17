/**
 * Página: aba IA – Verificação de urgência (/simulador/ia-urgencia)
 * Tela de "admin" do Modelo 2: formulário com idade, sexo, trauma, dor de 0 a 10 (useWatch mostra o valor)
 * e estado mental, ou "Sortear caso de exemplo" (preenche com um caso de data/casosUrgencia.ts).
 * Mostra se o caso é urgente, a probabilidade e o efeito na orientação, destacando a
 * regra "só pode elevar" com exemplos lado a lado.
 * Veio de: planejamento do grupo (não há tela equivalente no protótipo).
 * Endpoints: POST /verificar-urgencia (API Flask).
 * Estados: enviando ("Verificando..."), erro da API (400 sem campo, fora do ar) e sem resultado ainda.
 */
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { FiArrowRight, FiShuffle } from 'react-icons/fi';
import BarraProbabilidade from '../../../components/ia/BarraProbabilidade';
import CampoFormulario from '../../../components/CampoFormulario';
import LayoutAba from '../../../components/LayoutAba';
import MensagemErro from '../../../components/MensagemErro';
import PainelExplicacao from '../../../components/PainelExplicacao';
import SeloDemonstracao from '../../../components/SeloDemonstracao';
import SeloGravidade from '../../../components/SeloGravidade';
import { CASOS_URGENCIA, type CasoUrgencia } from '../../../data/casosUrgencia';
import { FLASK_URL, verificarUrgencia } from '../../../services/ia';
import type { VerificacaoUrgenciaSaida } from '../../../types';
import type { Cor } from '../../../types/orientacao';
import { mensagemDoErro } from '../../../utils/erros';

/** Campos do formulário. */
interface FormUrgencia {
  idade: string;
  sexo: '' | 'F' | 'M';
  trauma: 'SIM' | 'NAO';
  nrDor: string;
  estadoMental: 'ALERTA' | 'ALTERADO';
}

const BOTAO_CONTORNO =
  'flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-borda bg-branco px-5 font-bold text-primaria shadow-leve hover:bg-mentaSuave';
const SELECT = 'min-h-12 w-full rounded-xl border border-borda bg-branco px-4 text-texto outline-none focus:ring-2 focus:ring-primaria';

/** Um exemplo da regra "só eleva": cor das regras → resposta da IA → cor final. */
function Exemplo({ antes, ia, depois, explicacao }: { antes: Cor; ia: string; depois: Cor; explicacao: string }) {
  return (
    <article className="flex flex-col gap-2 rounded-xl border border-borda bg-branco p-3">
      <div className="flex flex-wrap items-center gap-2">
        <SeloGravidade cor={antes} tamanho="pequeno" />
        <FiArrowRight aria-hidden />
        <span className="text-sm font-bold text-textoSuave">{ia}</span>
        <FiArrowRight aria-hidden />
        <SeloGravidade cor={depois} tamanho="pequeno" />
      </div>
      <p className="text-sm text-textoSuave">{explicacao}</p>
    </article>
  );
}

/** Aba IA – Verificação de urgência (Modelo 2). */
export default function AbaIaUrgencia() {
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<FormUrgencia>({
    defaultValues: { idade: '', sexo: '', trauma: 'NAO', nrDor: '0', estadoMental: 'ALERTA' },
  });
  // useWatch: mostra a nota da dor enquanto a pessoa arrasta a barra.
  const dor = useWatch({ control, name: 'nrDor' });
  const [resultado, setResultado] = useState<VerificacaoUrgenciaSaida | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  // Caso de exemplo sorteado (mostrado embaixo do formulário).
  const [sorteado, setSorteado] = useState<CasoUrgencia | null>(null);

  /** Sorteia um caso de exemplo (diferente do atual) e preenche o formulário com ele. */
  const sortear = () => {
    const opcoes = CASOS_URGENCIA.filter((c) => c !== sorteado);
    const caso = opcoes[Math.floor(Math.random() * opcoes.length)];
    if (!caso) return;
    const e = caso.entrada;
    reset({
      idade: String(e.idade),
      sexo: e.sexo,
      trauma: e.trauma ? 'SIM' : 'NAO',
      nrDor: String(e.nrDor),
      estadoMental: e.estadoMentalAlerta ? 'ALERTA' : 'ALTERADO',
    });
    setSorteado(caso);
    setResultado(null);
    setErro(null);
  };

  /** Chama o Modelo 2 com os dados do formulário. */
  const enviar = handleSubmit(async (v) => {
    setErro(null);
    try {
      setResultado(
        await verificarUrgencia({
          idade: Number(v.idade),
          sexo: v.sexo === '' ? null : v.sexo,
          trauma: v.trauma === 'SIM',
          nrDor: Number(v.nrDor),
          estadoMentalAlerta: v.estadoMental === 'ALERTA',
        }),
      );
    } catch (e) {
      setErro(mensagemDoErro(e));
    }
  });

  return (
    <LayoutAba
      explicacao={
        <PainelExplicacao
          titulo="IA – Verificação de urgência (Modelo 2)"
          oQueFaz="Confere se um caso que deu verde ou azul nas regras da orientação pode ser urgente. Se for, a cor sobe para amarelo (UPA)."
          regras={[
            'Regra principal: o modelo só pode ELEVAR a cor (verde/azul → amarelo), nunca baixar.',
            'Base: Emergency Service – Triage Application (Kaggle), 1.267 registros com a escala KTAS, parecida com Manchester.',
            'Alvo: KTAS 1 a 3 = urgente; 4 e 5 = não urgente, usando a coluna KTAS_expert.',
            'Só entram dados que o cidadão consegue informar (sem pressão, saturação etc.).',
            'Métrica principal: recall da classe urgente. O limiar foi ajustado para baixo de propósito, porque deixar passar um caso urgente (falso negativo) é o erro perigoso.',
            'Na orientação, trauma só é perguntado na dor de cabeça (nas outras queixas vai "não"); a dor é perguntada em todas.',
          ]}
          tela="ia-urgencia"
        />
      }
    >
      <div className="flex flex-col gap-4">
        <section className="flex flex-col gap-1 rounded-xl border border-borda bg-branco p-4 shadow-leve">
          <h1 className="text-2xl font-extrabold text-primaria">IA – Verificação de urgência</h1>
          <p className="text-textoSuave">Informe os dados que o cidadão daria na orientação.</p>
          {!FLASK_URL && <SeloDemonstracao descricao="Sem a URL da API Flask, a verificação usa a simulação do protótipo (urgente com dor 7 ou mais e 65 anos ou mais)." />}
        </section>

        <form onSubmit={enviar} noValidate className="flex flex-col gap-4 rounded-xl border border-borda bg-branco p-4 shadow-leve">
          <div className="grid gap-4 md:grid-cols-2">
            <CampoFormulario id="idadeUrg" label="Idade" numerico erro={errors.idade}
              registro={register('idade', {
                required: 'Informe a idade.',
                pattern: { value: /^\d+$/, message: 'Use só números inteiros.' },
                validate: (v) => (Number(v) >= 18 && Number(v) <= 120) || 'A orientação é para adultos: use de 18 a 120.',
              })} />
            <div className="flex flex-col gap-1">
              <label htmlFor="sexoUrg" className="font-semibold">Sexo</label>
              <select id="sexoUrg" className={SELECT} aria-invalid={!!errors.sexo} {...register('sexo', { required: 'Informe o sexo.' })}>
                <option value="">Selecione</option>
                <option value="F">Feminino</option>
                <option value="M">Masculino</option>
              </select>
              {errors.sexo && <p className="text-sm font-semibold text-gravidade-vermelho">{errors.sexo.message}</p>}
            </div>
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-1 font-semibold">Trauma (bateu a cabeça antes da dor)</legend>
              <div className="flex gap-4">
                <label className="flex min-h-12 items-center gap-2"><input type="radio" value="NAO" className="h-5 w-5 accent-primaria" {...register('trauma')} /> Não</label>
                <label className="flex min-h-12 items-center gap-2"><input type="radio" value="SIM" className="h-5 w-5 accent-primaria" {...register('trauma')} /> Sim</label>
              </div>
            </fieldset>
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-1 font-semibold">Estado mental</legend>
              <div className="flex flex-wrap gap-4">
                <label className="flex min-h-12 items-center gap-2"><input type="radio" value="ALERTA" className="h-5 w-5 accent-primaria" {...register('estadoMental')} /> Alerta</label>
                <label className="flex min-h-12 items-center gap-2"><input type="radio" value="ALTERADO" className="h-5 w-5 accent-primaria" {...register('estadoMental')} /> Confuso, sonolento ou desmaiou</label>
              </div>
            </fieldset>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label htmlFor="dorUrg" className="flex items-baseline justify-between font-semibold">
                Nota da dor (0 a 10)
                <span className="text-2xl font-extrabold text-primaria" aria-live="polite">{dor}</span>
              </label>
              {/* defaultValue: sem ele, o range começa no meio (5) e o formulário lê esse valor do DOM */}
              <input id="dorUrg" type="range" min={0} max={10} step={1} defaultValue="0" className="h-12 w-full accent-primaria" {...register('nrDor')} />
              <div className="flex justify-between text-sm text-textoSuave"><span>0 = sem dor</span><span>10 = pior dor</span></div>
            </div>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <button type="button" onClick={sortear} className={BOTAO_CONTORNO}>
              <FiShuffle aria-hidden /> Sortear caso de exemplo
            </button>
            <button type="submit" disabled={isSubmitting}
              className="flex min-h-12 cursor-pointer items-center justify-center rounded-xl bg-primaria px-5 font-bold text-branco shadow-leve hover:bg-primariaEscura disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? 'Verificando...' : 'Verificar urgência'}
            </button>
          </div>
          {sorteado && (
            <p className="text-sm text-textoSuave">
              Caso sorteado: <span className="font-semibold text-texto">{sorteado.nome}</span> · {sorteado.descricao}
            </p>
          )}
        </form>

        {erro && <MensagemErro mensagem={erro} />}

        {resultado && (
          <section className="flex flex-col gap-4 rounded-xl border border-borda bg-branco p-4 shadow-leve" aria-live="polite">
            <p className="flex flex-wrap items-center gap-2 text-lg font-extrabold">
              Resultado:
              <span className={`rounded-full px-3 py-1 ${resultado.urgente ? 'bg-primaria text-branco' : 'bg-mentaSuave text-primaria'}`}>
                {resultado.urgente ? 'Urgente' : 'Não urgente'}
              </span>
            </p>
            <BarraProbabilidade valor={resultado.probabilidade} rotulo="Probabilidade de ser urgente" />
            <div className="flex flex-col gap-2 rounded-xl bg-mentaSuave p-3">
              <p className="font-bold text-primaria">Efeito na orientação</p>
              {resultado.urgente ? (
                <div className="flex flex-wrap items-center gap-2">
                  <SeloGravidade cor="VERDE" tamanho="pequeno" /> / <SeloGravidade cor="AZUL" tamanho="pequeno" />
                  <FiArrowRight aria-hidden />
                  <SeloGravidade cor="AMARELO" tamanho="pequeno" />
                  <span className="font-semibold">a cor sobe para amarelo e a pessoa é orientada a procurar a UPA.</span>
                </div>
              ) : (
                <p className="font-semibold">Mantém a cor das regras (verde ou azul: UBS).</p>
              )}
            </div>
          </section>
        )}

        {/* Regra "só pode elevar", com exemplos lado a lado */}
        <section className="flex flex-col gap-3 rounded-xl border-2 border-primaria bg-branco p-4">
          <h2 className="text-lg font-extrabold text-primaria">Regra: a IA só pode elevar a cor, nunca baixar</h2>
          <div className="grid gap-3 lg:grid-cols-3">
            <Exemplo antes="VERDE" ia="IA: urgente" depois="AMARELO" explicacao="Eleva: o caso vai para a UPA, mais cedo que na UBS." />
            <Exemplo antes="AZUL" ia="IA: não urgente" depois="AZUL" explicacao="Mantém: a cor das regras continua valendo." />
            <Exemplo antes="LARANJA" ia="IA não é chamada" depois="LARANJA" explicacao="Nunca baixa: amarelo, laranja e vermelho não passam pela IA." />
          </div>
        </section>
      </div>
    </LayoutAba>
  );
}
