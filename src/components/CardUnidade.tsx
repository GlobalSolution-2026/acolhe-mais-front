import { FiMapPin, FiPhone } from 'react-icons/fi';
import type { Unidade } from '../types';
import Botao from './Botao';

interface CardUnidadeProps {
  unidade: Unidade;
  /** Se informado, mostra o botão "Ver horários". */
  onVerHorarios?: () => void;
}

/** Card de uma UBS ou UPA: tipo, nome, endereço, CEP e telefone. */
export default function CardUnidade({ unidade, onVerHorarios }: CardUnidadeProps) {
  return (
    <article className="rounded-xl border border-borda bg-branco p-4 shadow-leve">
      <div className="mb-1 flex items-center gap-2">
        <span className="rounded-full bg-mentaSuave px-2 py-0.5 text-xs font-bold text-primaria">{unidade.tpUnidade}</span>
        <h3 className="font-bold text-texto">{unidade.nmUnidade}</h3>
      </div>
      <p className="flex items-start gap-2 text-sm text-textoSuave">
        <FiMapPin className="mt-0.5 shrink-0" aria-hidden />
        {unidade.dsEndereco} · CEP {unidade.nrCep}
      </p>
      <p className="flex items-center gap-2 text-sm text-textoSuave">
        <FiPhone aria-hidden />
        {unidade.nrTelefone}
      </p>
      {onVerHorarios && (
        <Botao variante="simulador" acao={onVerHorarios} className="mt-3 w-full">
          Ver horários
        </Botao>
      )}
    </article>
  );
}
