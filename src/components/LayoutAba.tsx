import type { ReactNode } from 'react';

interface LayoutAbaProps {
  /** Conteúdo principal da aba (celular, painel da recepção, formulário de IA...). */
  children: ReactNode;
  /** Painel de explicação (PainelExplicacao): ao lado no computador, embaixo no celular. */
  explicacao: ReactNode;
}

/**
 * Layout de cada aba do simulador: conteúdo principal + painel de explicação.
 * A partir de 1024 px (lg) o painel fica ao lado; abaixo disso, fica embaixo do conteúdo.
 */
export default function LayoutAba({ children, explicacao }: LayoutAbaProps) {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="min-w-0">{children}</div>
      <div className="lg:sticky lg:top-6">{explicacao}</div>
    </div>
  );
}
