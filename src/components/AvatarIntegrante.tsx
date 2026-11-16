import { useState } from 'react';

/** Tamanhos do avatar: cartão e painel (80 px) ou "outros integrantes" (44 px). */
const TAMANHOS = {
  grande: 'h-20 w-20 text-2xl',
  pequeno: 'h-11 w-11 text-sm',
};

/** Propriedades do avatar. */
interface AvatarIntegranteProps {
  nome: string;
  foto?: string;
  tamanho?: keyof typeof TAMANHOS;
}

/**
 * Iniciais do nome: primeira letra do primeiro e do último nome (ex.: "Ana Carolina Orcelli Bautzer" → "AB").
 * @param nome nome completo
 */
function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  const ultima = partes.length > 1 ? partes[partes.length - 1] : '';
  return `${partes[0][0]}${ultima[0] ?? ''}`.toUpperCase();
}

/**
 * Foto redonda do integrante. Sem foto, ou se a imagem não carregar (onError),
 * mostra as iniciais em círculo azul-marinho com letras em menta.
 * Decorativo (aria-hidden): o nome sempre aparece em texto ao lado.
 * Para trocar de pessoa, o componente pai usa key, e o estado de erro volta ao início.
 */
export default function AvatarIntegrante({ nome, foto, tamanho = 'grande' }: AvatarIntegranteProps) {
  const [fotoFalhou, setFotoFalhou] = useState(false);
  const classeBase = `${TAMANHOS[tamanho]} shrink-0 rounded-full`;

  if (foto && !fotoFalhou) {
    return (
      <img
        src={foto}
        alt=""
        aria-hidden="true"
        onError={() => setFotoFalhou(true)}
        className={`${classeBase} object-cover`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`${classeBase} flex items-center justify-center bg-primaria font-extrabold text-menta`}
    >
      {iniciais(nome)}
    </span>
  );
}
