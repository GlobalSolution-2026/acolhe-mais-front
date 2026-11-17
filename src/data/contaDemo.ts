/**
 * Contas com senha do modo demonstração e ficha de saúde da conta principal.
 * As senhas são as mesmas da carga de teste do banco: os perfis de teste entram nos dois modos.
 */
import type { CodigoDoencaBase, CredencialCidadao, FichaSaude } from "../types";

/** Senha das contas de teste (Maria, Pedro e Carlos), igual à da carga do banco. */
export const SENHA_TESTE = "acolhe123";

/** DEMONSTRAÇÃO: conta principal (Maria Silva) exibida no Modo demonstração. */
export const CONTA_DEMO = { idCidadao: 1, nrCns: "111222233334444", dsSenha: SENHA_TESTE } as const;

/** Credenciais do mock: só os cidadãos com tpAcesso SENHA na carga do banco (1 Maria, 4 Pedro e 6 Carlos). */
export const credenciaisIniciais: CredencialCidadao[] = [1, 4, 6].map((idCidadao) => ({ idCidadao, dsSenha: SENHA_TESTE }));

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
