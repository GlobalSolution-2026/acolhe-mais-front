import { FiTrash2 } from 'react-icons/fi';
import { useRequisicoes } from '../../context/useRequisicoes';
import type { NomeApi } from '../../types';
import { formatarHora } from '../../utils/formatadores';
import BadgeMetodo from '../BadgeMetodo';
import EstadoVazio from '../EstadoVazio';

const NOME_API: Record<NomeApi, string> = { JAVA: 'Java', FLASK: 'Flask', VIACEP: 'ViaCEP', FRONT: 'Só no front' };

/** Texto e cor do status HTTP (2xx destaque menta; erro em azul-marinho; sem resposta em cinza). */
function rotuloStatus(status: number | null): { texto: string; classe: string } {
  if (status === null) return { texto: 'sem resposta', classe: 'bg-borda text-texto' };
  if (status < 400) return { texto: String(status), classe: 'bg-menta text-primariaEscura' };
  return { texto: String(status), classe: 'bg-primariaEscura text-branco' };
}

/**
 * Painel de requisições ao vivo (RequisicoesContext): as últimas chamadas feitas enquanto
 * a pessoa navega pelo simulador, com método, rota, API, status, tempo e se foi real ou demonstração.
 */
export default function PainelRequisicoes() {
  const { requisicoes, limparRequisicoes } = useRequisicoes();

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-borda bg-branco p-4 shadow-leve">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-extrabold text-primaria">Requisições ao vivo</h2>
          <p className="text-sm text-textoSuave">Últimas {requisicoes.length} chamadas feitas no simulador (máximo de 30).</p>
        </div>
        <button
          type="button"
          onClick={limparRequisicoes}
          disabled={requisicoes.length === 0}
          className="flex min-h-12 cursor-pointer items-center gap-2 rounded-xl border border-borda bg-branco px-4 font-bold text-primaria hover:bg-mentaSuave disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FiTrash2 aria-hidden /> Limpar
        </button>
      </div>

      {requisicoes.length === 0 ? (
        <EstadoVazio mensagem="Nenhuma chamada ainda. Navegue pelas abas Cidadão e Recepção para ver as requisições aparecerem aqui." />
      ) : (
        <ul className="flex flex-col divide-y divide-borda" aria-live="polite">
          {requisicoes.map((r) => {
            const status = rotuloStatus(r.status);
            return (
              <li key={r.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2 text-sm">
                <BadgeMetodo metodo={r.metodo} />
                <code className="min-w-0 flex-1 break-all font-mono">{r.rota}</code>
                <span className="text-textoSuave">{NOME_API[r.api]}</span>
                <span className={`rounded-md px-2 py-0.5 font-bold ${status.classe}`}>{status.texto}</span>
                <span className="w-16 text-right tabular-nums">{r.tempoMs} ms</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${r.demonstracao ? 'bg-mentaSuave text-primaria' : 'bg-primaria text-branco'}`}>
                  {r.demonstracao ? 'Demonstração' : 'Real'}
                </span>
                <span className="text-xs text-textoSuave">{formatarHora(r.dtRequisicao)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
