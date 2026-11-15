/**
 * Unidades de exemplo em São Paulo (3 UBS e 2 UPA), usadas no modo demonstração.
 * CEP e telefone só com números, como a API Java devolve; a tela formata.
 */
import type { Unidade } from "../types";

export const unidadesIniciais: Unidade[] = [
  { idUnidade: 1, nmUnidade: "UBS Vila Mariana", tpUnidade: "UBS", dsEndereco: "Rua Domingos de Morais, 1200 – Vila Mariana", nrCep: "04010100", nrTelefone: "1150841100" },
  { idUnidade: 2, nmUnidade: "UBS Pinheiros", tpUnidade: "UBS", dsEndereco: "Rua Teodoro Sampaio, 850 – Pinheiros", nrCep: "05405000", nrTelefone: "1130622200" },
  { idUnidade: 3, nmUnidade: "UBS Tatuapé", tpUnidade: "UBS", dsEndereco: "Rua Tuiuti, 1500 – Tatuapé", nrCep: "03081000", nrTelefone: "1120913300" },
  { idUnidade: 4, nmUnidade: "UPA Santana", tpUnidade: "UPA", dsEndereco: "Av. Voluntários da Pátria, 2400 – Santana", nrCep: "02010000", nrTelefone: "1129714400" },
  { idUnidade: 5, nmUnidade: "UPA Campo Limpo", tpUnidade: "UPA", dsEndereco: "Estrada do Campo Limpo, 3000 – Campo Limpo", nrCep: "05777000", nrTelefone: "1158415500" },
];
