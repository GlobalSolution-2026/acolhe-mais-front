import { formatarPorcentagem } from '../../utils/formatadores';

interface BarraProbabilidadeProps {
  /** Probabilidade de 0 a 1. */
  valor: number;
  /** Limiar do modelo (0 a 1), marcado na barra. */
  limiar: number;
  /** Texto do limiar (ex.: "Limiar de risco ALTO"). */
  rotuloLimiar: string;
  /** Nome do que a barra mede (para leitores de tela). */
  rotulo: string;
}

/**
 * Barra de probabilidade feita só com Tailwind (sem biblioteca de gráficos), com a marca do limiar.
 * Usada nas abas de IA para mostrar a saída dos modelos.
 */
export default function BarraProbabilidade({ valor, limiar, rotuloLimiar, rotulo }: BarraProbabilidadeProps) {
  const porcentagem = Math.max(0, Math.min(1, valor)) * 100;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between">
        <span className="font-semibold">{rotulo}</span>
        <span className="text-3xl font-extrabold text-primaria">{formatarPorcentagem(valor)}</span>
      </div>
      <div
        className="relative h-5 w-full overflow-hidden rounded-full bg-borda"
        role="meter"
        aria-label={rotulo}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(porcentagem)}
      >
        <div className="h-full rounded-full bg-primaria transition-all" style={{ width: `${porcentagem}%` }} />
        {/* Marca do limiar */}
        <div className="absolute inset-y-0 w-1 bg-menta" style={{ left: `calc(${limiar * 100}% - 2px)` }} aria-hidden />
      </div>
      <div className="relative h-5 text-xs text-textoSuave">
        <span className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${limiar * 100}%` }}>
          {rotuloLimiar}: {formatarPorcentagem(limiar)}
        </span>
      </div>
    </div>
  );
}
