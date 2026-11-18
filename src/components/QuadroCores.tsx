import { CORES, ORDEM_CORES } from '../data/cores';

/**
 * Quadro "O que significam as cores" das páginas institucionais: as 5 cores lado a lado.
 * Usa os mesmos dados do simulador (data/cores.ts), para os nomes nunca ficarem diferentes.
 * Regra de acessibilidade: a cor sempre aparece com o número (1 = mais grave) e o destino.
 */
export default function QuadroCores() {
  return (
    <div className="rounded-2xl border border-borda bg-fundo p-6">
      <h3 className="text-lg font-bold text-primaria">O que significam as cores</h3>
      <p className="text-sm text-textoSuave">Cada cor tem um número, do 1 (mais grave) ao 5 (menos grave).</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {ORDEM_CORES.map((cor) => {
          const dados = CORES[cor];
          return (
            <li key={cor} className="flex items-center gap-3 rounded-xl bg-branco p-3 shadow-leve">
              <span
                aria-hidden="true"
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-extrabold ${dados.classe}`}
              >
                {dados.nrNivel}
              </span>
              <span className="font-bold">
                <span className="sr-only">Nível {dados.nrNivel}: </span>
                {dados.nmSelo}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
