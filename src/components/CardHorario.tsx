import { fmtDia } from '../lib/datas';
import type { Horario } from '../types';
import { formatarHora } from '../utils/formatadores';

interface CardHorarioProps {
  horario: Horario;
  selecionado?: boolean;
  onSelecionar?: (horario: Horario) => void;
}

/**
 * Botão de um horário da UBS (dia e hora).
 * Horário ocupado aparece riscado e desabilitado; o selecionado fica em azul-marinho.
 */
export default function CardHorario({ horario, selecionado = false, onSelecionar }: CardHorarioProps) {
  const estilo = horario.flOcupado
    ? 'cursor-not-allowed border-borda bg-fundo text-textoSuave line-through'
    : selecionado
      ? 'cursor-pointer border-primaria bg-primaria text-branco'
      : 'cursor-pointer border-borda bg-branco text-texto hover:border-primaria';

  return (
    <button
      type="button"
      disabled={horario.flOcupado}
      aria-pressed={selecionado}
      onClick={() => onSelecionar?.(horario)}
      className={`flex min-h-12 flex-col items-center justify-center rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${estilo}`}
    >
      <span>{fmtDia(horario.dtHorario)}</span>
      <span className="text-base">{formatarHora(horario.dtHorario)}</span>
    </button>
  );
}
