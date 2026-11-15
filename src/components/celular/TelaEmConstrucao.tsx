import { FiTool } from 'react-icons/fi';

interface TelaEmConstrucaoProps {
  /** Nome da tela (ex.: "Minhas consultas"). */
  titulo: string;
  /** Em qual bloco a tela fica pronta (ex.: "bloco 4"). */
  previsao: string;
}

/** Tela do celular que ainda não foi feita (aparece dentro da moldura). */
export default function TelaEmConstrucao({ titulo, previsao }: TelaEmConstrucaoProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-borda bg-branco px-4 py-10 text-center">
      <FiTool size={30} className="text-primaria" aria-hidden />
      <h1 className="text-2xl font-extrabold text-primaria">{titulo}</h1>
      <p className="font-bold">Em construção</p>
      <p className="text-base text-textoSuave">Esta tela entra no {previsao}.</p>
    </div>
  );
}
