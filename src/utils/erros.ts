/** Mensagem quando nem chegou resposta (API fora do ar, sem internet ou o Render ainda "acordando"). */
const MENSAGEM_SEM_CONEXAO = 'Não foi possível conectar ao Acolhe+. Verifique sua internet ou tente de novo em instantes.';

/**
 * Transforma qualquer erro numa mensagem para mostrar na tela.
 * Erros da API já chegam com o texto do ErroDTO (campo mensagem); falha de rede (TypeError do fetch) vira a mensagem de conexão.
 */
export const mensagemDoErro = (err: unknown) =>
  err instanceof Error && !(err instanceof TypeError) ? err.message : MENSAGEM_SEM_CONEXAO;
