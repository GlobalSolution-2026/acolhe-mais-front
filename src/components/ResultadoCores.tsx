import { CORES } from '../data/cores';
import type { ResultadoCor } from '../types/institucional';

/**
 * Lista do resultado da orientação na página Solução: círculo numerado com a cor e o destino.
 * As cores e os números vêm de data/cores.ts, os mesmos do simulador.
 * Regra de acessibilidade: a cor nunca aparece sozinha (número + nome + destino).
 * @param resultados linhas do resultado (verde e azul podem vir juntos na mesma linha)
 */
export default function ResultadoCores({ resultados }: { resultados: ResultadoCor[] }) {
  return (
    <ul className="mt-2 flex flex-col gap-2">
      {resultados.map(({ cores, titulo, texto }) => (
        <li key={titulo} className="flex items-start gap-3">
          <span aria-hidden="true" className="flex shrink-0 gap-1">
            {cores.map((cor) => (
              <span
                key={cor}
                className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-extrabold ${CORES[cor].classe}`}
              >
                {CORES[cor].nrNivel}
              </span>
            ))}
          </span>
          <span className="text-texto">
            <span className="sr-only">Nível {cores.map((cor) => CORES[cor].nrNivel).join(' e ')}: </span>
            <strong>{titulo}:</strong> {texto}
          </span>
        </li>
      ))}
    </ul>
  );
}
