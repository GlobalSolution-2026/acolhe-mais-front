import type { Cor } from '../types/orientacao';

/**
 * Cor de fundo, cor do texto e nome de cada gravidade.
 * Regra de acessibilidade: o selo sempre mostra o nome além da cor; no amarelo o texto é escuro.
 */
const ESTILO: Record<Cor, { classe: string; nome: string }> = {
  VERMELHO: { classe: 'bg-gravidade-vermelho text-branco', nome: 'Vermelho – SAMU' },
  LARANJA: { classe: 'bg-gravidade-laranja text-branco', nome: 'Laranja – Pronto-socorro' },
  AMARELO: { classe: 'bg-gravidade-amarelo text-texto', nome: 'Amarelo – UPA' },
  VERDE: { classe: 'bg-gravidade-verde text-branco', nome: 'Verde – UBS' },
  AZUL: { classe: 'bg-gravidade-azul text-branco', nome: 'Azul – UBS' },
};

interface SeloGravidadeProps {
  cor: Cor;
  /** 'grande' no resultado da orientação; 'pequeno' em listas (ex.: lista do dia). */
  tamanho?: 'grande' | 'pequeno';
}

/** Selo com a cor e o destino da orientação (ex.: "Amarelo – UPA"). */
export default function SeloGravidade({ cor, tamanho = 'grande' }: SeloGravidadeProps) {
  const estilo = ESTILO[cor];
  const medidas = tamanho === 'grande' ? 'rounded-xl px-4 py-3 text-xl' : 'rounded-full px-3 py-0.5 text-sm';
  return (
    <span className={`inline-block text-center font-extrabold shadow-leve ${medidas} ${estilo.classe}`}>
      {estilo.nome}
    </span>
  );
}
