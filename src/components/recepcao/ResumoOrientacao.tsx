import { queixas } from '../../data/queixas';
import { fmtDiaHora } from '../../lib/datas';
import type { Orientacao } from '../../types/orientacao';
import SeloGravidade from '../SeloGravidade';

/** Cor, código, queixa e data de uma orientação salva (usado no balcão da recepção). Veio do protótipo. */
export default function ResumoOrientacao({ orientacao }: { orientacao: Orientacao }) {
  const queixa = queixas.find((q) => q.idQueixa === orientacao.idQueixa);
  return (
    <section className="flex flex-col gap-2 rounded-xl border border-borda bg-branco p-4 shadow-leve">
      <SeloGravidade cor={orientacao.dsCor} tamanho="pequeno" />
      <p><strong>Código:</strong> {orientacao.idOrientacao}</p>
      <p><strong>Queixa:</strong> {queixa?.nmQueixa ?? '—'}</p>
      <p><strong>Data:</strong> {fmtDiaHora(orientacao.dtOrientacao)}</p>
    </section>
  );
}
