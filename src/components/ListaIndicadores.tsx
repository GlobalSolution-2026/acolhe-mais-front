import type { Indicador } from '../types/institucional';

/** Colunas no computador: indicador, como é calculado e origem. */
const COLUNAS = 'md:grid-cols-[1.2fr_2fr_0.8fr]';

/**
 * Tabela "Como o impacto será medido" da página Solução (Tabela 4 do documento).
 * No computador vira 3 colunas com cabeçalho; no celular, cada indicador vira um cartão.
 * Os indicadores que o painel da recepção já calcula ganham "· no painel" na origem.
 * @param indicadores lista de indicadores de impacto
 */
export default function ListaIndicadores({ indicadores }: { indicadores: Indicador[] }) {
  return (
    <>
      <div className={`mt-4 hidden gap-4 px-4 text-sm font-bold text-textoSuave md:grid ${COLUNAS}`}>
        <span>Indicador</span>
        <span>Como é calculado</span>
        <span>Origem</span>
      </div>
      <ul className="mt-2 flex flex-col gap-2">
        {indicadores.map(({ nome, calculo, origem, noPainel }) => (
          <li
            key={nome}
            className={`grid gap-1 rounded-2xl border border-borda bg-branco p-4 md:items-center md:gap-4 ${COLUNAS}`}
          >
            <p className="font-bold text-primaria">{nome}</p>
            <p className="text-texto">{calculo}</p>
            <p className="text-sm font-semibold text-textoSuave">
              {origem}
              {noPainel && ' · no painel'}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
