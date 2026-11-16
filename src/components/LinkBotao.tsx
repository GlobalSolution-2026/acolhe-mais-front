import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

/** Propriedades do link com cara de botão. */
interface LinkBotaoProps {
  /** Rota de destino (ex.: "/simulador"). */
  para: string;
  children: ReactNode;
  /** 'primario' = fundo azul-marinho; 'secundario' = só o contorno. */
  variante?: 'primario' | 'secundario';
  className?: string;
}

/**
 * Link do React Router com a mesma aparência do Botao (48 px de altura, cantos de 12 px).
 * Usado quando o clique leva a outra página: assim o leitor de tela anuncia um link, não um botão.
 */
export default function LinkBotao({ para, children, variante = 'primario', className = '' }: LinkBotaoProps) {
  const base = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 font-bold transition-colors';

  const variantes = {
    primario: 'bg-primaria text-branco shadow-leve hover:bg-primariaEscura',
    secundario: 'border-2 border-primaria text-primaria hover:bg-mentaSuave',
  };

  return (
    <Link to={para} className={`${base} ${variantes[variante]} ${className}`}>
      {children}
    </Link>
  );
}
