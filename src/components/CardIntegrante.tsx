import { Link } from 'react-router-dom';

import type { Integrante } from '../types/institucional';
import AvatarIntegrante from './AvatarIntegrante';

/**
 * Cartão de um integrante na página /integrantes: foto ou iniciais, nome, função, RM e turma.
 * O único botão, "Ver perfil", leva a /integrantes/:rm, que abre o painel lateral.
 * @param integrante dados do integrante (src/data/integrantes.ts)
 */
export default function CardIntegrante({ integrante }: { integrante: Integrante }) {
  const { rm, nome, funcao, turma, foto, iniciais } = integrante;

  return (
    <li className="flex flex-col items-center rounded-2xl border border-borda bg-branco p-6 text-center shadow-leve">
      <AvatarIntegrante nome={nome} foto={foto} iniciaisFixas={iniciais} />
      <h2 className="mt-4 text-lg font-bold leading-snug text-primaria">{nome}</h2>
      <p className="mt-1 text-texto">{funcao}</p>
      <p className="mb-5 mt-1 text-sm text-textoSuave">
        RM {rm} · {turma}
      </p>
      <Link
        to={`/integrantes/${rm}`}
        aria-label={`Ver perfil de ${nome}`}
        className="mt-auto inline-flex min-h-12 w-full items-center justify-center rounded-xl border-2 border-primaria font-bold text-primaria transition-colors hover:bg-mentaSuave"
      >
        Ver perfil
      </Link>
    </li>
  );
}
