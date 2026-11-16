/**
 * Classes Tailwind compartilhadas pelos formulários das páginas institucionais.
 */

/**
 * Classe de input, select e textarea das páginas institucionais (ex.: Contato).
 * @param comErro true quando o campo tem erro de validação: a borda fica vermelha
 * @returns classes com altura mínima de 48 px, cantos de 12 px e foco em menta
 */
export function classeControle(comErro: boolean): string {
  return `min-h-12 w-full rounded-xl border bg-branco px-4 text-texto focus:border-primaria focus:outline-2 focus:outline-menta ${
    comErro ? 'border-gravidade-vermelho' : 'border-borda'
  }`;
}
