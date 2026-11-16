import { FiClipboard } from 'react-icons/fi';
import { queixas } from '../../data/queixas';
import { chaveDia, fmtDia } from '../../lib/datas';
import type { Cor, Orientacao } from '../../types/orientacao';

const NOME_COR: Record<Cor, string> = { VERMELHO: 'vermelho', LARANJA: 'laranja', AMARELO: 'amarelo', VERDE: 'verde', AZUL: 'azul' };

/** Nome da queixa de uma orientação salva. */
const nomeQueixa = (o: Orientacao) => queixas.find((q) => q.idQueixa === o.idQueixa)?.nmQueixa ?? 'queixa';

interface SeloOrientacaoHojeProps {
  orientacao: Orientacao;
  /** Dia de hoje ("aaaa-mm-dd"). */
  hoje: string;
}

/**
 * Lembrete para quem vai atender na UBS de que a pessoa procurou orientação (queixa e cor).
 * Veio do protótipo. Orientação de outro dia (fila com prioridade) mostra a data em vez de "hoje".
 */
export default function SeloOrientacaoHoje({ orientacao, hoje }: SeloOrientacaoHojeProps) {
  const rotulo = chaveDia(orientacao.dtOrientacao) === hoje
    ? 'Fez orientação hoje'
    : `Orientação da fila (${fmtDia(orientacao.dtOrientacao, false)})`;
  return (
    <span className="inline-flex items-center gap-1 self-start rounded-full bg-mentaSuave px-2 py-0.5 text-xs font-bold text-primaria">
      <FiClipboard aria-hidden /> {rotulo}: {nomeQueixa(orientacao)}, {NOME_COR[orientacao.dsCor]}
    </span>
  );
}
