/** As 5 queixas atendidas pela orientação (tela Início do celular). */
import type { CodigoQueixa, Queixa } from "../types/orientacao";

export const queixas: Queixa[] = [
  { idQueixa: 1, codigo: "GRIPAL", nmQueixa: "Síndrome gripal" },
  { idQueixa: 2, codigo: "GARGANTA", nmQueixa: "Dor de garganta" },
  { idQueixa: 3, codigo: "DIARREIA", nmQueixa: "Diarreia e vômito" },
  { idQueixa: 4, codigo: "CABECA", nmQueixa: "Dor de cabeça" },
  { idQueixa: 5, codigo: "URINA", nmQueixa: "Ardência ao urinar" },
];

/** Busca a queixa pelo código (ex.: "GRIPAL"). */
export function obterQueixa(codigo: CodigoQueixa): Queixa {
  return queixas.find((q) => q.codigo === codigo)!;
}
