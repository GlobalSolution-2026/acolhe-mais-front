import type { ReactNode } from 'react';

interface BotaoProps {
  children: ReactNode;
  acao?: () => void;
  tipo?: 'button' | 'submit' | 'reset';
  /** 'simulador' e 'simuladorContorno' usam a paleta do simulador (azul-marinho + menta). */
  variante?: 'primario' | 'secundario' | 'escuro' | 'simulador' | 'simuladorContorno';
  desabilitado?: boolean;
  className?: string;
}

export default function Botao({
  children,
  acao,
  tipo = 'button',
  variante = 'primario',
  desabilitado = false,
  className = '',
}: BotaoProps) {

  // Efeito de onda ajustado para um tom verde claro suave
  const efeitoOnda =
    "relative overflow-hidden after:content-[''] after:absolute after:inset-0 after:z-[1] after:pointer-events-none after:rounded-t-[45%] after:bg-[#00d186]/20 after:translate-y-full after:transition-transform after:duration-500 hover:after:translate-y-[10%] active:after:translate-y-[10%] focus-visible:after:translate-y-[10%] disabled:after:translate-y-full";

  const base = `${efeitoOnda} px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 inline-flex items-center justify-center select-none active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer`;

  const variantes = {
    primario:
      'bg-[#004d3a] hover:bg-[#003829] text-white shadow-sm hover:shadow',
    secundario:
      'border-2 border-[#148565] hover:bg-[#148565] hover:text-white text-[#148565] bg-transparent transition-colors',
    escuro: 'bg-[#1C1C1C] hover:bg-stone-800 text-white shadow-sm',
  };

  // Simulador: botões com os tokens do @theme, altura mínima de 48 px, cantos de 12 px e sombra leve.
  // Têm base própria para não misturar com o efeito de onda verde das páginas institucionais.
  const baseSimulador =
    'min-h-12 px-5 rounded-xl font-bold font-nunito inline-flex items-center justify-center gap-2 shadow-leve transition-colors select-none cursor-pointer active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed';

  const variantesSimulador = {
    simulador: 'bg-primaria hover:bg-primariaEscura text-branco',
    simuladorContorno: 'border-2 border-primaria bg-branco text-primaria hover:bg-mentaSuave',
  };

  const classes =
    variante === 'simulador' || variante === 'simuladorContorno'
      ? `${baseSimulador} ${variantesSimulador[variante]}`
      : `${base} ${variantes[variante]}`;

  return (
    <button
      type={tipo}
      onClick={acao}
      disabled={desabilitado}
      className={`${classes} ${className}`}
    >
      {children}
    </button>
  );
}