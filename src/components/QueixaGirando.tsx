import { useEffect, useState } from 'react';

/** Propriedades da queixa que gira no título. */
interface QueixaGirandoProps {
  /** Textos que se revezam (sem o ponto final, que é acrescentado aqui). */
  queixas: string[];
  /** Tempo de cada queixa na tela, em milissegundos. */
  intervalo?: number;
}

/**
 * Parte do título que troca de queixa a cada 2,5 s, subindo uma e entrando a seguinte.
 * Acessibilidade: o leitor de tela lê a lista completa (sr-only) e ignora a parte animada (aria-hidden);
 * quem pediu menos movimento no sistema vê a troca sem animação (motion-reduce).
 */
export default function QueixaGirando({ queixas, intervalo = 2500 }: QueixaGirandoProps) {
  const [indice, setIndice] = useState(0);

  // Troca a queixa em intervalos fixos; o clearInterval evita timer solto ao sair da página.
  useEffect(() => {
    const timer = setInterval(() => setIndice((atual) => (atual + 1) % queixas.length), intervalo);
    return () => clearInterval(timer);
  }, [queixas.length, intervalo]);

  /** Posição de cada queixa: a atual no lugar, a anterior saindo por cima, as outras esperando embaixo. */
  const posicao = (i: number) => {
    if (i === indice) return 'translate-y-0 opacity-100';
    if (i === (indice - 1 + queixas.length) % queixas.length) return '-translate-y-full opacity-0';
    return 'translate-y-full opacity-0';
  };

  const listaCompleta = `${queixas.slice(0, -1).join(', ')} ou ${queixas[queixas.length - 1]}.`;

  return (
    <>
      <span className="sr-only">{listaCompleta}</span>
      {/* 1.4em: altura de uma linha mais o fundo menta, sem cortar a parte de baixo */}
      <span aria-hidden="true" className="relative mt-2 block h-[1.4em] overflow-hidden">
        {queixas.map((queixa, i) => (
          <span
            key={queixa}
            className={`absolute inset-x-0 top-0 transition-all duration-700 ease-in-out motion-reduce:transition-none ${posicao(i)}`}
          >
            <span className="rounded-lg bg-menta px-2 text-primariaEscura box-decoration-clone">{queixa}.</span>
          </span>
        ))}
      </span>
    </>
  );
}
