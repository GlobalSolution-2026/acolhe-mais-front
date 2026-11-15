/**
 * Horários de exemplo das 3 UBS (modo demonstração).
 * Regra: só dias úteis (sem sábado, domingo e feriado nacional), das 8h às 16h, consultas de 20 min.
 */
import type { Horario } from "../types";
import { isDiaUtil } from "../lib/datas";

/** Oito dias úteis anteriores, hoje (se for dia útil) e dez dias úteis posteriores. */
export function gerarHorariosIniciais(base: Date = new Date()): Horario[] {
  const hoje = new Date(base);
  hoje.setHours(0, 0, 0, 0);
  const dias: Date[] = isDiaUtil(hoje) ? [hoje] : [];
  for (const [sentido, quantidade] of [[-1, 8], [1, 10]] as const) {
    const d = new Date(hoje);
    let encontrados = 0;
    while (encontrados < quantidade) {
      d.setDate(d.getDate() + sentido);
      if (isDiaUtil(d)) { dias.push(new Date(d)); encontrados++; }
    }
  }
  dias.sort((a, b) => a.getTime() - b.getTime());
  const horarios: Horario[] = [];
  for (const idUnidade of [1, 2, 3]) for (const dia of dias) for (const hora of [8, 9, 10, 11, 14, 15, 16]) {
    const dt = new Date(dia);
    dt.setHours(hora);
    horarios.push({ idHorario: horarios.length + 1, idUnidade, dtHorario: dt.toISOString(), nrDuracaoMinuto: 20, flOcupado: false });
  }
  return horarios;
}
