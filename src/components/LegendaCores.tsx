import { CORES, ORDEM_CORES } from '../data/cores';
import type { Cor } from '../types/orientacao';

interface LegendaCoresProps {
  /** Cor do resultado da pessoa; a linha dela ganha borda, fundo e o texto "(seu resultado)". */
  destaque?: Cor;
}

/**
 * Legenda das cores de gravidade, que abre e fecha com <details>/<summary> (sem useState).
 * Mostra as 5 cores do nível 1 ao 5: número, nome, significado e onde ir.
 * Acessibilidade (WCAG 1.4.1): explica cada cor com texto, não só com a cor.
 */
export default function LegendaCores({ destaque }: LegendaCoresProps) {
  return (
    <details className="rounded-xl border border-borda bg-branco p-4 shadow-leve">
      <summary className="min-h-12 cursor-pointer content-center text-lg font-bold text-primaria">O que significam as cores?</summary>
      <p className="mt-2 text-textoSuave">Cada cor tem um número, do 1 (mais grave) ao 5 (menos grave).</p>
      <ul className="mt-3 flex flex-col gap-2">
        {ORDEM_CORES.map((cor) => {
          const dados = CORES[cor];
          const ehDestaque = cor === destaque;
          return (
            <li
              key={cor}
              className={`flex items-start gap-3 rounded-xl border-2 p-3 ${ehDestaque ? 'border-primaria bg-mentaSuave' : 'border-transparent'}`}
            >
              <span aria-hidden="true" className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-extrabold ${dados.classe}`}>
                {dados.nrNivel}
              </span>
              <div>
                <p className="font-bold">
                  <span className="sr-only">Nível {dados.nrNivel}: </span>
                  {dados.nmCor}
                  {ehDestaque && <span className="text-primaria"> (seu resultado)</span>}
                </p>
                <p>{dados.dsSignificado}</p>
                <p className="text-textoSuave">{dados.dsOndeIr}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
