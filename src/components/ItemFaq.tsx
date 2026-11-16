import type { PerguntaFaq } from '../types/institucional';

/** Propriedades de uma pergunta do acordeão. */
interface ItemFaqProps {
  item: PerguntaFaq;
  /** true quando esta pergunta está aberta. */
  aberto: boolean;
  /** Abre ou fecha esta pergunta (o estado fica na página). */
  onAlternar: () => void;
}

/**
 * Uma pergunta do acordeão da FAQ.
 * A pergunta é um botão com aria-expanded e aria-controls, para o leitor de tela saber se está aberta.
 * A resposta só é desenhada quando a pergunta está aberta, para não ser lida escondida.
 */
export default function ItemFaq({ item, aberto, onAlternar }: ItemFaqProps) {
  const idResposta = `resposta-${item.id}`;

  return (
    <div
      className={`rounded-2xl border bg-branco shadow-leve transition-colors ${aberto ? 'border-primaria' : 'border-borda'}`}
    >
      <h3>
        <button
          type="button"
          onClick={onAlternar}
          aria-expanded={aberto}
          aria-controls={idResposta}
          className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left text-lg font-bold text-primaria"
        >
          {item.pergunta}
          <span
            aria-hidden="true"
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xl leading-none ${
              aberto ? 'bg-menta text-primariaEscura' : 'bg-mentaSuave text-primaria'
            }`}
          >
            {aberto ? '−' : '+'}
          </span>
        </button>
      </h3>
      {aberto && (
        <p id={idResposta} className="px-5 pb-5 leading-relaxed text-texto">
          {item.resposta}
        </p>
      )}
    </div>
  );
}
