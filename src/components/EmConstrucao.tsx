import { FiTool } from 'react-icons/fi';

interface EmConstrucaoProps {
  /** Nome da aba (ex.: "Recepção UBS"). */
  titulo: string;
  /** Em qual bloco a aba fica pronta (ex.: "bloco 5"). */
  previsao?: string;
}

/** Aviso das abas do simulador que ainda não foram feitas. */
export default function EmConstrucao({ titulo, previsao }: EmConstrucaoProps) {
  return (
    <section className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-borda bg-branco px-6 py-16 text-center">
      <FiTool size={36} className="text-primaria" aria-hidden />
      <h2 className="text-2xl font-extrabold text-primaria">{titulo}</h2>
      <p className="text-lg font-bold text-texto">Em construção</p>
      {previsao && <p className="text-textoSuave">Esta aba entra no {previsao}.</p>}
    </section>
  );
}
