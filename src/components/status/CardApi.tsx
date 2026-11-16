import { useEffect, useState } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { mensagemDoErro } from '../../utils/erros';
import { formatarHora } from '../../utils/formatadores';

/** Situação de uma API depois da verificação. */
export type SituacaoApi = 'VERIFICANDO' | 'ONLINE' | 'FORA_DO_AR' | 'NAO_CONFIGURADA' | 'DEMONSTRACAO';

/** Nome e cor (só tokens da paleta, sem cores de gravidade) de cada situação. */
const ESTILO: Record<SituacaoApi, { nome: string; classe: string }> = {
  VERIFICANDO: { nome: 'Verificando...', classe: 'bg-fundo text-textoSuave' },
  ONLINE: { nome: 'Online', classe: 'bg-menta text-primariaEscura' },
  FORA_DO_AR: { nome: 'Fora do ar', classe: 'bg-primariaEscura text-branco' },
  NAO_CONFIGURADA: { nome: 'Não configurada', classe: 'bg-borda text-texto' },
  DEMONSTRACAO: { nome: 'Demonstração', classe: 'bg-mentaSuave text-primaria' },
};

interface Resultado {
  situacao: SituacaoApi;
  tempoMs: number | null;
  horario: string | null;
  mensagem: string | null;
}

interface CardApiProps {
  nome: string;
  /** URL da API; vazia = variável de ambiente não configurada. */
  url: string | undefined;
  /** Nome da variável de ambiente (para explicar como configurar). */
  variavel?: string;
  /** Chamada usada para verificar (ex.: GET /unidades). */
  rotaVerificacao: string;
  /** Faz a chamada de verificação (real ou de demonstração). */
  verificar: () => Promise<unknown>;
  /** Muda quando o botão "Verificar agora" do topo é clicado. */
  rodada: number;
}

/**
 * Card de uma API na aba Status: situação, URL, tempo de resposta e horário da última verificação.
 * Sem URL, mostra "Não configurada" e verifica o modo demonstração (que responde em ~400 ms).
 */
export default function CardApi({ nome, url, variavel, rotaVerificacao, verificar, rodada }: CardApiProps) {
  const [resultado, setResultado] = useState<Resultado>({ situacao: 'VERIFICANDO', tempoMs: null, horario: null, mensagem: null });
  // Muda a cada clique no botão do card.
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;
    const inicio = performance.now();
    verificar()
      .then(() => {
        if (!ativo) return;
        setResultado({
          situacao: url ? 'ONLINE' : 'DEMONSTRACAO',
          tempoMs: Math.round(performance.now() - inicio),
          horario: new Date().toISOString(),
          mensagem: null,
        });
      })
      .catch((e: unknown) => {
        if (!ativo) return;
        setResultado({
          situacao: 'FORA_DO_AR',
          tempoMs: Math.round(performance.now() - inicio),
          horario: new Date().toISOString(),
          // Sem resposta (TypeError do fetch) vira a mensagem de conexão; erro HTTP mostra a mensagem da API.
          mensagem: mensagemDoErro(e),
        });
      });
    return () => {
      ativo = false;
    };
    // verificar é recriada a cada render; quem decide quando verificar de novo são os botões.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rodada, tentativa, url]);

  /** Botão do card: mostra "Verificando..." e verifica de novo. */
  const verificarAgora = () => {
    setResultado((r) => ({ ...r, situacao: 'VERIFICANDO' }));
    setTentativa((t) => t + 1);
  };

  const estilo = ESTILO[resultado.situacao];
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-borda bg-branco p-4 shadow-leve">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-extrabold text-primaria">{nome}</h2>
        <span className={`rounded-full px-3 py-1 text-sm font-extrabold ${estilo.classe}`} role="status">{estilo.nome}</span>
      </div>
      {!url && (
        <p className="flex flex-wrap items-center gap-2 text-sm">
          <span className={`rounded-full px-2 py-0.5 font-bold ${ESTILO.NAO_CONFIGURADA.classe}`}>Não configurada</span>
          <span className="text-textoSuave">{variavel} vazia: o simulador usa o modo demonstração.</span>
        </p>
      )}
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        <dt className="font-semibold text-textoSuave">URL</dt>
        <dd className="break-all font-mono">{url ?? '—'}</dd>
        <dt className="font-semibold text-textoSuave">Verificação</dt>
        <dd className="break-all font-mono">{rotaVerificacao}</dd>
        <dt className="font-semibold text-textoSuave">Tempo</dt>
        <dd>{resultado.tempoMs !== null ? `${resultado.tempoMs} ms` : '—'}</dd>
        <dt className="font-semibold text-textoSuave">Última verificação</dt>
        <dd>{resultado.horario ? formatarHora(resultado.horario) : '—'}</dd>
      </dl>
      {resultado.mensagem && <p className="text-sm font-semibold text-primaria">{resultado.mensagem}</p>}
      <button
        type="button"
        onClick={verificarAgora}
        disabled={resultado.situacao === 'VERIFICANDO'}
        className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-borda bg-branco px-4 font-bold text-primaria shadow-leve hover:bg-mentaSuave disabled:cursor-wait disabled:opacity-60"
      >
        <FiRefreshCw aria-hidden /> Verificar de novo
      </button>
    </article>
  );
}
