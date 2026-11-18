import type { ReactNode } from 'react';

/**
 * Etiqueta em formato de pílula que aparece acima dos títulos das páginas institucionais
 * (ex.: "Sobre o projeto", "Contato").
 * @param children texto da etiqueta
 */
export default function Etiqueta({ children }: { children: ReactNode }) {
  return (
    <span className="w-fit rounded-full bg-mentaSuave px-3 py-1 text-sm font-bold text-primaria">{children}</span>
  );
}
