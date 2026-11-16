import type { ReactNode } from 'react';

/** Propriedades do botão: conteúdo, ação de clique, tipo do <button>, variante visual e estado. */
interface BotaoProps {
  children: ReactNode;
  acao?: () => void;
  tipo?: 'button' | 'submit' | 'reset';
  /** 'simulador' e 'simuladorContorno' usam a paleta do simulador (azul-marinho + menta). */
  variante?: 'primario' | 'secundario' | 'escuro' | 'simulador' | 'simuladorContorno';
  desabilitado?: boolean;
  className?: string;
}

/**
 * Botão reutilizável do site.
 * Variantes 'primario', 'secundario' e 'escuro' nas páginas institucionais;
 * 'simulador' e 'simuladorContorno' dentro do simulador.
 */
export default function Botao({
  children,
  acao,
  tipo = 'button',
  variante = 'primario',
  desabilitado = false,
  className = '',
}: BotaoProps) {

  // Páginas institucionais: tokens do @theme, altura mínima de 48 px e cantos de 12 px (seção 10).
  const base =
    'min-h-12 px-6 rounded-xl font-bold inline-flex items-center justify-center gap-2 transition-colors select-none cursor-pointer active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed';

  const variantes = {
    primario: 'bg-primaria hover:bg-primariaEscura text-branco shadow-leve',
    secundario: 'border-2 border-primaria bg-transparent text-primaria hover:bg-mentaSuave',
    escuro: 'bg-primariaEscura hover:bg-primaria text-branco shadow-leve',
  };

  // Simulador: botões com os tokens do @theme, altura mínima de 48 px, cantos de 12 px e sombra leve.
  // Têm base própria (com font-nunito e sombra fixa) para não mudar o visual já testado do simulador.
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