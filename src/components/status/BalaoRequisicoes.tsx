import { useState } from 'react';
import { FiActivity, FiChevronDown, FiTrash2 } from 'react-icons/fi';
import { useRequisicoes } from '../../context/useRequisicoes';
import type { NomeApi, Requisicao } from '../../types';
import { formatarHora } from '../../utils/formatadores';
import BadgeMetodo from '../BadgeMetodo';

/** Nome de cada API em cada linha do balão. */
const NOME_API: Record<NomeApi, string> = {
  JAVA: 'API Java',
  FLASK: 'API Flask',
  VIACEP: 'ViaCEP',
  FRONT: 'Só no front',
};

/**
 * Cor pelo status: 2xx deu certo (verde), 4xx foi barrado por uma regra da API (amarelo),
 * 5xx ou sem resposta é falha (vermelho). No amarelo o texto é escuro, para ter contraste.
 * @returns classes da etiqueta (chip) e da bolinha do botão
 */
function corDoStatus(status: number | null): { chip: string; ponto: string } {
  if (status === null || status >= 500) return { chip: 'bg-gravidade-vermelho text-branco', ponto: 'bg-gravidade-vermelho' };
  if (status >= 400) return { chip: 'bg-gravidade-amarelo text-texto', ponto: 'bg-gravidade-amarelo' };
  return { chip: 'bg-gravidade-verde text-branco', ponto: 'bg-gravidade-verde' };
}

/** Uma chamada na lista: método, rota e status; embaixo, horário, tempo, API e se foi demonstração. */
function LinhaRequisicao({ requisicao: r }: { requisicao: Requisicao }) {
  return (
    <li className="px-4 py-2.5">
      <div className="flex items-center gap-2">
        <BadgeMetodo metodo={r.metodo} />
        <code className="min-w-0 flex-1 break-all font-mono text-sm">{r.rota}</code>
        <span className={`shrink-0 rounded-md px-2 py-0.5 font-mono text-xs font-bold ${corDoStatus(r.status).chip}`}>
          {r.status ?? 'sem resposta'}
        </span>
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-textoSuave">
        <span>{formatarHora(r.dtRequisicao)}</span>
        <span className="tabular-nums">{r.tempoMs} ms</span>
        <span className="font-semibold">{NOME_API[r.api]}</span>
        {/* Respondida pelo mock do front (modo demonstração), não pela API de verdade */}
        {r.demonstracao && <span className="rounded-full bg-mentaSuave px-2 font-bold text-primaria">demonstração</span>}
      </div>
    </li>
  );
}

/**
 * Balão de requisições (mesmo formato do simulador do Lobo-guará): botão flutuante no canto inferior
 * esquerdo, em todas as abas do simulador, que abre a lista das últimas chamadas (RequisicoesContext).
 * No celular e no tablet fica numa faixa de largura total embaixo; o Simulador deixa um espaço no fim da
 * página para o balão não cobrir a barra inferior do celular. A altura máxima deixa o Header à vista.
 */
export default function BalaoRequisicoes() {
  const { requisicoes, limparRequisicoes } = useRequisicoes();
  const [aberto, setAberto] = useState(false);
  // A lista já vem da mais nova para a mais antiga.
  const ultima = requisicoes[0];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 lg:inset-x-auto lg:bottom-6 lg:left-6 lg:w-[30rem]">
      {aberto && (
        <section
          id="balao-requisicoes"
          aria-label="Requisições do simulador"
          className="pointer-events-auto mx-4 flex max-h-[calc(100dvh-16rem)] flex-col overflow-hidden rounded-2xl border border-borda bg-branco font-nunito text-texto shadow-celular lg:mx-0 lg:mb-3 lg:max-h-[calc(100dvh-12rem)]"
        >
          <div className="flex items-center justify-between gap-3 border-b border-borda px-4 py-3">
            <div>
              <h2 className="font-extrabold text-primaria">Requisições</h2>
              <p className="text-xs text-textoSuave">API Java, API Flask, ViaCEP e só no front · mais novas primeiro</p>
            </div>
            <button
              type="button"
              onClick={limparRequisicoes}
              disabled={requisicoes.length === 0}
              className="inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-borda px-3 text-sm font-bold text-primaria hover:bg-mentaSuave disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiTrash2 aria-hidden /> Limpar
            </button>
          </div>

          {requisicoes.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-textoSuave">
              Nenhuma requisição ainda. Use o simulador para ver as chamadas aqui.
            </p>
          ) : (
            <ul className="divide-y divide-borda overflow-y-auto" aria-live="polite">
              {requisicoes.map((r) => (
                <LinhaRequisicao key={r.id} requisicao={r} />
              ))}
            </ul>
          )}
        </section>
      )}

      <div className="p-4 pt-3 lg:p-0">
        <button
          type="button"
          onClick={() => setAberto((atual) => !atual)}
          aria-expanded={aberto}
          aria-controls="balao-requisicoes"
          className="pointer-events-auto flex min-h-12 cursor-pointer items-center gap-2 rounded-full bg-primaria px-4 font-nunito font-bold text-branco shadow-celular hover:bg-primariaEscura"
        >
          <FiActivity aria-hidden />
          Requisições
          <span className="rounded-full bg-branco/20 px-2 text-sm tabular-nums">{requisicoes.length}</span>
          {ultima && (
            <>
              <span aria-hidden="true" title="Status da última requisição" className={`h-2.5 w-2.5 rounded-full ring-2 ring-branco/60 ${corDoStatus(ultima.status).ponto}`} />
              <span className="sr-only">Última: {ultima.status ?? 'sem resposta'}</span>
            </>
          )}
          <FiChevronDown aria-hidden className={`ml-1 transition-transform ${aberto ? '' : 'rotate-180'}`} />
        </button>
      </div>
    </div>
  );
}
