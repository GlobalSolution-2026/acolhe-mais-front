import type { Alternativa } from '../types/institucional';

/** Propriedades da comparação com as alternativas que já existem. */
interface ListaAlternativasProps {
  alternativas: Alternativa[];
  /** Linha final do Acolhe+: o que ele faz e os limites desta versão. */
  acolhe: { faz: string; limites: string };
}

/** Colunas da comparação no computador (alternativa, o que faz, o que falta). */
const COLUNAS = 'md:grid-cols-[1.1fr_1.4fr_1.6fr]';

/**
 * Comparação "O que já existe" da página Sobre.
 * No computador vira uma tabela de 3 colunas; no celular, cada alternativa vira um cartão
 * e o terceiro texto ganha o rótulo "Falta:", porque o cabeçalho das colunas fica escondido.
 */
export default function ListaAlternativas({ alternativas, acolhe }: ListaAlternativasProps) {
  return (
    <>
      <div className={`mt-8 hidden gap-4 border-b border-borda pb-2 text-sm font-bold text-textoSuave md:grid ${COLUNAS}`}>
        <span>Alternativa</span>
        <span>O que faz</span>
        <span>O que falta para este problema</span>
      </div>
      <ul className="mt-4 flex flex-col gap-3 md:mt-0 md:gap-0">
        {alternativas.map(({ nome, origem, faz, falta }) => (
          <li
            key={nome}
            className={`grid gap-1 rounded-2xl border border-borda p-4 md:gap-4 md:rounded-none md:border-0 md:border-b md:px-0 ${COLUNAS}`}
          >
            <p className="font-bold text-primaria">
              {nome} <span className="block text-sm font-semibold text-textoSuave">{origem}</span>
            </p>
            <p className="text-texto">{faz}</p>
            <p className="text-texto">
              <span className="font-bold text-gravidade-vermelho md:hidden">Falta: </span>
              {falta}
            </p>
          </li>
        ))}
        {/* Linha do Acolhe+ em destaque, sem esconder os limites desta versão */}
        <li className={`grid gap-1 rounded-2xl border-2 border-menta bg-mentaSuave p-4 md:mt-3 md:gap-4 ${COLUNAS}`}>
          <p className="font-extrabold text-primaria">Acolhe+</p>
          <p className="text-texto">{acolhe.faz}</p>
          <p className="text-texto">{acolhe.limites}</p>
        </li>
      </ul>
    </>
  );
}
