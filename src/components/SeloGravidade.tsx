import { CORES } from '../data/cores';
import type { Cor } from '../types/orientacao';

interface SeloGravidadeProps {
  cor: Cor;
  /** 'grande' no resultado da orientação; 'pequeno' em listas (ex.: lista do dia). */
  tamanho?: 'grande' | 'pequeno';
}

/**
 * Selo com o número do nível, a cor e o destino da orientação (ex.: "3 Amarelo – UPA").
 * Acessibilidade (WCAG 1.4.1): a cor nunca aparece sozinha. O número fica num círculo branco com texto escuro,
 * e o leitor de tela lê "Nível X:" antes do nome. No amarelo o texto é escuro, para ter contraste.
 */
export default function SeloGravidade({ cor, tamanho = 'grande' }: SeloGravidadeProps) {
  const dados = CORES[cor];
  const grande = tamanho === 'grande';
  const medidas = grande ? 'gap-3 rounded-xl px-4 py-3 text-xl' : 'gap-1.5 rounded-full py-0.5 pl-1 pr-3 text-sm';
  const circulo = grande ? 'h-8 w-8 text-base' : 'h-5 w-5 text-xs';
  return (
    <span className={`inline-flex items-center justify-center text-center font-extrabold shadow-leve ${medidas} ${dados.classe}`}>
      <span aria-hidden="true" className={`flex shrink-0 items-center justify-center rounded-full bg-branco text-texto ${circulo}`}>
        {dados.nrNivel}
      </span>
      <span className="sr-only">Nível {dados.nrNivel}:</span>
      {/* O nome fica sozinho num span, para continuar sendo encontrado pelo texto exato (ex.: "Amarelo – UPA"). */}
      <span>{dados.nmSelo}</span>
    </span>
  );
}
