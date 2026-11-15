/**
 * Classes Tailwind dos botões e links-botão do celular (mesmo visual do componente Botao, variante simulador).
 * Ficam aqui para os <Link> e <a> que precisam parecer botão sem repetir a lista de classes.
 * Regra visual do simulador: altura mínima de 48 px, cantos de 12 px e sombra leve.
 */
const BASE = "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 font-bold shadow-leve transition-colors";

/** Botão principal (azul-marinho). */
export const BOTAO_PRIMARIO = `${BASE} bg-primaria text-branco hover:bg-primariaEscura`;

/** Botão secundário (contorno). */
export const BOTAO_CONTORNO = `${BASE} border border-borda bg-branco text-primaria hover:bg-mentaSuave`;

/** Botão de emergência (vermelho de gravidade, só para SAMU/Emergência). */
export const BOTAO_EMERGENCIA = `${BASE} bg-gravidade-vermelho text-branco`;
