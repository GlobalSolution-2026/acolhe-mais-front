/**
 * Faixa de emergência mostrada no topo de todas as páginas do site (acima do cabeçalho).
 * Regra: o Acolhe+ orienta, não atende. Em risco imediato, a pessoa precisa ver logo
 * o SAMU (192) e o Disque-Intoxicação (0800 722 6001), sem precisar navegar.
 * Os números são links "tel:" para ligar direto pelo celular.
 */
export default function FaixaEmergencia() {
  return (
    <div className="bg-gravidade-vermelho text-branco">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-2 text-center text-sm font-bold sm:justify-between lg:px-6">
        <span>
          Emergência? Ligue{' '}
          <a href="tel:192" className="underline underline-offset-2">
            192 (SAMU)
          </a>
        </span>
        <span className="font-semibold">
          Intoxicação:{' '}
          <a href="tel:08007226001" className="underline underline-offset-2">
            0800 722 6001
          </a>
          , 24 horas
        </span>
      </div>
    </div>
  );
}
