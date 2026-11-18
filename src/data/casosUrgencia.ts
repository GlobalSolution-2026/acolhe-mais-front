/**
 * Casos de exemplo da aba IA – Verificação de urgência (botão "Sortear caso de exemplo").
 * Cada caso tem os dados que o cidadão informaria na orientação, para mostrar o Modelo 2 sem precisar digitar.
 * Os casos misturam situações que a API Flask classifica como urgentes e como não urgentes
 * (conferido com a API real em 17/11/2026). No modo demonstração, o resultado segue a simulação do protótipo.
 */
import type { VerificacaoUrgenciaEntrada } from "../types/orientacao";

/** Um caso de exemplo: nome curto, a história em uma frase e a entrada do Modelo 2. */
export interface CasoUrgencia {
  nome: string;
  descricao: string;
  /** Sexo sempre preenchido: o formulário da aba exige F ou M. */
  entrada: Omit<VerificacaoUrgenciaEntrada, "sexo"> & { sexo: "F" | "M" };
}

export const CASOS_URGENCIA: CasoUrgencia[] = [
  {
    nome: "Dor de garganta leve",
    descricao: "Adulto jovem com dor de garganta fraca, sem pancada e bem acordado.",
    entrada: { idade: 25, sexo: "M", trauma: false, nrDor: 3, estadoMentalAlerta: true },
  },
  {
    nome: "Bateu a cabeça, dor leve",
    descricao: "Adulto jovem com dor de cabeça fraca depois de bater a cabeça, bem acordado.",
    entrada: { idade: 25, sexo: "M", trauma: true, nrDor: 3, estadoMentalAlerta: true },
  },
  {
    nome: "Dor forte",
    descricao: "Adulta com dor forte (nota 7), sem pancada e bem acordada.",
    entrada: { idade: 45, sexo: "F", trauma: false, nrDor: 7, estadoMentalAlerta: true },
  },
  {
    nome: "Idosa com dor forte",
    descricao: "Pessoa de 72 anos com dor forte (nota 8), sem pancada e bem acordada.",
    entrada: { idade: 72, sexo: "F", trauma: false, nrDor: 8, estadoMentalAlerta: true },
  },
  {
    nome: "Pessoa confusa, sem dor",
    descricao: "Adulto de 60 anos sem dor, mas confuso ou sonolento.",
    entrada: { idade: 60, sexo: "M", trauma: false, nrDor: 0, estadoMentalAlerta: false },
  },
  {
    nome: "Jovem com dor moderada",
    descricao: "Pessoa de 19 anos com dor moderada (nota 5), sem pancada e bem acordada.",
    entrada: { idade: 19, sexo: "F", trauma: false, nrDor: 5, estadoMentalAlerta: true },
  },
  {
    nome: "Idoso que caiu, dor leve",
    descricao: "Pessoa de 80 anos com dor fraca depois de bater a cabeça, bem acordada.",
    entrada: { idade: 80, sexo: "M", trauma: true, nrDor: 2, estadoMentalAlerta: true },
  },
  {
    nome: "Ardência ao urinar, dor leve",
    descricao: "Adulta com ardência ao urinar e dor fraca (nota 2), bem acordada.",
    entrada: { idade: 30, sexo: "F", trauma: false, nrDor: 2, estadoMentalAlerta: true },
  },
];
