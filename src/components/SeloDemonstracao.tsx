import { FiInfo } from 'react-icons/fi';

interface SeloDemonstracaoProps {
  /** Explicação curta abaixo do selo. Sem ela, mostra só o selo "Demonstração". */
  descricao?: string;
}

/**
 * Selo "Demonstração": avisa que a tela está usando os dados de exemplo do front,
 * e não a API (variável de ambiente vazia, ou função que não existe na API Java).
 */
export default function SeloDemonstracao({ descricao }: SeloDemonstracaoProps) {
  if (!descricao) {
    return (
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-dashed border-primaria/40 bg-mentaSuave px-3 py-1 text-sm font-bold text-primaria">
        <FiInfo aria-hidden />
        Demonstração
      </span>
    );
  }
  return (
    <div role="note" className="rounded-xl border-2 border-dashed border-primaria/40 bg-mentaSuave p-3">
      <p className="flex items-center gap-1.5 font-extrabold text-primaria">
        <FiInfo aria-hidden />
        Demonstração
      </p>
      <p className="text-textoSuave">{descricao}</p>
    </div>
  );
}
