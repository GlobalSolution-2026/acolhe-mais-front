export const formatarPontos = (valor: number) =>
  valor.toLocaleString('pt-BR', { maximumFractionDigits: 2 });

/** Data "aaaa-mm-dd" → "dd/mm/aaaa" (ex.: data de nascimento). */
export const formatarData = (iso: string) => iso.split('-').reverse().join('/');

/** Hora de uma data ISO no horário local: "09:00". */
export const formatarHora = (iso: string) =>
  new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

/** Cartão SUS (15 números) em blocos, como aparece no cartão: "111 2222 3333 4444". */
export function formatarCns(cns: string): string {
  const d = cns.replace(/\D/g, '');
  if (d.length !== 15) return cns;
  return `${d.slice(0, 3)} ${d.slice(3, 7)} ${d.slice(7, 11)} ${d.slice(11)}`;
}

/** Telefone com DDD: "(11) 98888-0001" (celular) ou "(11) 5084-1100" (fixo). Outros formatos ficam como vieram. */
export function formatarTelefone(telefone: string): string {
  const d = telefone.replace(/\D/g, '');
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return telefone;
}

/** CEP com hífen: "04010100" → "04010-100". */
export function formatarCep(cep: string): string {
  const d = cep.replace(/\D/g, '');
  return d.length === 8 ? `${d.slice(0, 5)}-${d.slice(5)}` : cep;
}

/** Probabilidade 0–1 em porcentagem: 0.62 → "62%". */
export const formatarPorcentagem = (valor: number) => `${Math.round(valor * 100)}%`;
