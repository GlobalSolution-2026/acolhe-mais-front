/**
 * Perfis para testar o simulador (painel "Perfis para testar", como no simulador do Lobo-guará).
 * São pessoas da carga de teste do banco, com os mesmos ids e Cartões SUS no mock
 * (src/data/consultasIniciais.ts): o painel funciona no modo demonstração e com a API Java ligada.
 */

/** Conta com senha que entra no celular pelo botão "Entrar →". */
export interface PerfilCidadaoTeste {
  idCidadao: number;
  nmCidadao: string;
  nrCns: string;
  /** O que este perfil ajuda a mostrar. */
  demonstra: string;
}

/** Cartão SUS para digitar no balcão da Recepção (sem botão de entrar: no balcão não há login do cidadão). */
export interface CnsBalcaoTeste {
  nmCidadao: string;
  nrCns: string;
  demonstra: string;
}

/** Contas com senha (tpAcesso SENHA). A senha é SENHA_TESTE (data/contaDemo.ts). */
export const PERFIS_CIDADAO: PerfilCidadaoTeste[] = [
  { idCidadao: 1, nmCidadao: 'Maria Silva', nrCns: '111222233334444', demonstra: 'Conta principal, com consultas para confirmar e cancelar' },
  { idCidadao: 4, nmCidadao: 'Pedro Lima', nrCns: '444555566667777', demonstra: 'Conta sem faltas (risco baixo)' },
  { idCidadao: 6, nmCidadao: 'Carlos Nunes', nrCns: '666777788889999', demonstra: 'Conta com consultas confirmadas' },
];

/**
 * Cartões SUS para buscar no balcão da Recepção.
 * O último não existe no mock (os de exemplo do 9 em diante começam com 0) nem na carga do banco:
 * a busca não encontra ninguém e o balcão oferece o cadastro.
 */
export const CNS_BALCAO: CnsBalcaoTeste[] = [
  { nmCidadao: 'Sebastiana Ramos', nrCns: '333444455556666', demonstra: 'Sem contato, risco ALTO' },
  { nmCidadao: 'Juliana Santos', nrCns: '700000000000006', demonstra: 'Só contato de recado' },
  { nmCidadao: 'Sem cadastro', nrCns: '898000000000001', demonstra: 'Mostra o cadastro no balcão' },
];
