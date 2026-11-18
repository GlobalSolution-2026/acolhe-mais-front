import type { Atalho } from '../types/institucional';

/** Propriedades dos atalhos da página. */
interface AtalhosPaginaProps {
  atalhos: Atalho[];
  /** Nome lido pelo leitor de tela (ex.: "Atalhos da página"). */
  rotulo?: string;
}

/**
 * Atalhos em formato de pílula que levam a seções da mesma página (âncoras "#id").
 * Usa <a> comum, e não Link do React Router, porque o destino está na própria página.
 * A rolagem suave vem do index.css (só para quem não pediu menos movimento).
 */
export default function AtalhosPagina({ atalhos, rotulo = 'Atalhos da página' }: AtalhosPaginaProps) {
  return (
    <nav aria-label={rotulo} className="mt-8 flex flex-wrap gap-2 text-sm font-bold">
      {atalhos.map(({ id, nome }) => (
        <a
          key={id}
          href={`#${id}`}
          className="rounded-full border border-borda px-4 py-2 text-primaria transition-colors hover:bg-mentaSuave"
        >
          {nome}
        </a>
      ))}
    </nav>
  );
}
