import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';
import CampoFormulario from '../CampoFormulario';
import { alternarOpcao, podeContinuar, textoPergunta } from '../../services/regrasOrientacao';
import type { Pergunta, Resposta, Respostas } from '../../types/orientacao';

/** Botão de resposta (Sim, Não, Não sei e opções). */
const BOTAO_RESPOSTA =
  'flex min-h-12 w-full cursor-pointer items-center justify-center rounded-xl border-2 border-borda bg-branco px-4 text-lg font-bold text-texto shadow-leve hover:border-primaria';
const BOTAO_CONTINUAR =
  'flex min-h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-primaria px-4 font-bold text-branco shadow-leve hover:bg-primariaEscura disabled:cursor-not-allowed disabled:opacity-50';

/** Pergunta de número (idade), com validação do react-hook-form. */
function CampoNumero({ onResponder }: { onResponder: (valor: number) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<{ valor: string }>();
  return (
    <form onSubmit={handleSubmit(({ valor }) => onResponder(Number(valor)))} className="flex flex-col gap-3" noValidate>
      <CampoFormulario
        id="idade"
        label="Idade em anos"
        tipo="number"
        numerico
        erro={errors.valor}
        registro={register('valor', {
          required: 'Informe a idade.',
          pattern: { value: /^\d+$/, message: 'Use só números.' },
          min: { value: 0, message: 'Idade inválida.' },
          max: { value: 120, message: 'Idade inválida.' },
        })}
      />
      <button type="submit" className={BOTAO_CONTINUAR}>Continuar</button>
    </form>
  );
}

/**
 * Pergunta de marcar (múltipla escolha): cada opção marcada vira um sinal no resultado.
 * Regra: "Nenhum destes" e "Não sei" são exclusivas (marcar uma desmarca as outras).
 */
function Multipla({ pergunta, onResponder }: { pergunta: Pergunta; onResponder: (valor: string[]) => void }) {
  const [marcados, setMarcados] = useState<string[]>([]);
  const ok = podeContinuar(pergunta, marcados);
  return (
    <div className="flex flex-col gap-2">
      {pergunta.opcoes?.map((o) => {
        const ativo = marcados.includes(o.valor);
        return (
          <button
            key={o.valor}
            type="button"
            onClick={() => setMarcados((m) => alternarOpcao(m, o.valor))}
            aria-pressed={ativo}
            className={`flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-2 text-left text-lg font-bold shadow-leve ${
              ativo ? 'border-primaria bg-mentaSuave text-primaria' : 'border-borda bg-branco text-texto'
            }`}
          >
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${ativo ? 'border-primaria bg-primaria text-branco' : 'border-borda'}`}>
              {ativo && <FiCheck size={16} aria-hidden />}
            </span>
            {o.rotulo}
          </button>
        );
      })}
      {!ok && <p className="text-sm text-textoSuave">Marque pelo menos uma opção.</p>}
      <button type="button" onClick={() => onResponder(marcados)} disabled={!ok} className={`mt-2 ${BOTAO_CONTINUAR}`}>
        Continuar
      </button>
    </div>
  );
}

/** Escala de dor de 0 a 10 (um botão por nota). */
function EscalaDor({ onResponder }: { onResponder: (valor: number) => void }) {
  return (
    <div>
      <div className="grid grid-cols-6 gap-2">
        {Array.from({ length: 11 }, (_, n) => (
          <button key={n} type="button" onClick={() => onResponder(n)} className={`${BOTAO_RESPOSTA} min-h-14 px-0 text-xl`}>
            {n}
          </button>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-base text-textoSuave">
        <span>0 = sem dor</span>
        <span>10 = pior dor</span>
      </div>
    </div>
  );
}

/** Mostra as respostas certas para o tipo da pergunta. */
function RespostasPergunta({ pergunta, onResponder }: { pergunta: Pergunta; onResponder: (valor: Resposta) => void }) {
  switch (pergunta.tipoResposta) {
    case 'NUMERO':
      return <CampoNumero onResponder={onResponder} />;
    case 'MULTIPLA':
      return <Multipla pergunta={pergunta} onResponder={onResponder} />;
    case 'ESCALA_DOR':
      return <EscalaDor onResponder={onResponder} />;
    default: {
      // SIM_NAO, SIM_NAO_NAOSEI e OPCOES: um botão por resposta.
      const opcoes =
        pergunta.tipoResposta === 'OPCOES'
          ? pergunta.opcoes ?? []
          : [
              { valor: 'SIM', rotulo: 'Sim' },
              { valor: 'NAO', rotulo: 'Não' },
              ...(pergunta.tipoResposta === 'SIM_NAO_NAOSEI' ? [{ valor: 'NAO_SEI', rotulo: 'Não sei' }] : []),
            ];
      return (
        <div className="flex flex-col gap-3">
          {opcoes.map((o) => (
            <button key={o.valor} type="button" onClick={() => onResponder(o.valor)} className={BOTAO_RESPOSTA}>
              {o.rotulo}
            </button>
          ))}
        </div>
      );
    }
  }
}

interface PerguntaAtualProps {
  pergunta: Pergunta;
  /** 0 a 1: quanto do questionário já foi respondido. */
  progresso: number;
  /** Respostas até agora (para trocar "você" por "a pessoa" no texto). */
  respostas: Respostas;
  onResponder: (codigo: string, valor: Resposta) => void;
}

/**
 * Barra de progresso + texto da pergunta + respostas. Veio do protótipo (RespostasPergunta.tsx).
 * Não guarda estado próprio: é usado no celular e, no bloco 5, no balcão da recepção.
 */
export default function PerguntaAtual({ pergunta, progresso, respostas, onResponder }: PerguntaAtualProps) {
  return (
    <>
      <div
        className="h-3 w-full overflow-hidden rounded-full bg-borda"
        role="progressbar"
        aria-label="Progresso da orientação"
        aria-valuenow={Math.round(progresso * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="h-full rounded-full bg-primaria transition-all" style={{ width: `${Math.max(4, progresso * 100)}%` }} />
      </div>
      <h1 className="text-2xl font-extrabold leading-snug">{textoPergunta(pergunta, respostas)}</h1>
      {/* key: ao trocar de pergunta, o formulário/marcações começam do zero */}
      <RespostasPergunta key={pergunta.codigo} pergunta={pergunta} onResponder={(v) => onResponder(pergunta.codigo, v)} />
    </>
  );
}

/** Botão "Pergunta anterior" (desfaz a última resposta). */
export function BotaoPerguntaAnterior({ onVoltar }: { onVoltar: () => void }) {
  return (
    <button type="button" onClick={onVoltar} className="flex min-h-12 cursor-pointer items-center gap-2 font-bold text-primaria">
      <FiArrowLeft aria-hidden /> Pergunta anterior
    </button>
  );
}
