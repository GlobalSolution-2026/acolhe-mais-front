import { FiInbox } from 'react-icons/fi';

interface EstadoVazioProps {
  /** Texto explicando por que não há nada (ex.: "Nenhum horário livre nesta UBS."). */
  mensagem?: string;
}

/**
 * Estado "vazio" das telas do simulador: a chamada deu certo, mas não veio nenhum item.
 */
export default function EstadoVazio({ mensagem = 'Nada por aqui ainda.' }: EstadoVazioProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl bg-mentaSuave p-6 text-center text-textoSuave">
      <FiInbox size={32} className="text-primaria" aria-hidden />
      <p>{mensagem}</p>
    </div>
  );
}
