/**
 * Conta de exemplo do modo demonstração (Cartão SUS + senha) e ficha de saúde dela.
 * Usada enquanto POST /cidadaos/login ainda não existe na API Java.
 */
import type { CodigoDoencaBase, CredencialCidadao, FichaSaude } from "../types";

/** DEMONSTRAÇÃO: conta de exemplo exibida no Modo demonstração. */
export const CONTA_DEMO = { idCidadao: 1, nrCns: "111222233334444", dsSenha: "acolhe123" } as const;

export const credenciaisIniciais: CredencialCidadao[] = [{ idCidadao: CONTA_DEMO.idCidadao, dsSenha: CONTA_DEMO.dsSenha }];

export const DOENCAS_BASE: { cd: CodigoDoencaBase; nm: string }[] = [
  { cd: "DIABETES", nm: "Diabetes" },
  { cd: "HIPERTENSAO", nm: "Hipertensão (pressão alta)" },
  { cd: "PULMAO", nm: "Asma ou outra doença do pulmão" },
  { cd: "CORACAO", nm: "Doença do coração" },
  { cd: "RINS", nm: "Doença dos rins" },
  { cd: "IMUNIDADE", nm: "Baixa imunidade" },
  { cd: "OUTRA", nm: "Outra" },
];

/**
 * Ficha de saúde de exemplo da conta demo (prévia da integração com o Meu SUS).
 * @param agora momento de referência, para a data de atualização parecer recente
 */
export function fichasIniciais(agora: Date): FichaSaude[] {
  return [{
    idCidadao: CONTA_DEMO.idCidadao,
    dsDoencasBase: ["HIPERTENSAO", "DIABETES"],
    dsOutraDoenca: "",
    medicamentos: [{ nmMedicamento: "Losartana", dsDose: "50 mg, 1 vez ao dia" }, { nmMedicamento: "Metformina", dsDose: "850 mg, 2 vezes ao dia" }],
    dsAlergias: "Dipirona",
    dsTipoSanguineo: "O+",
    flConsentimento: true,
    dtAtualizacao: new Date(agora.getTime() - 3 * 86_400_000).toISOString(),
  }];
}
