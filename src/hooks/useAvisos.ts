/**
 * Avisos do cidadão logado: pedidos de confirmação e ofertas de vaga.
 * A regra fica num lugar só para o sino e a tela Avisos nunca mostrarem números diferentes:
 * o Celular busca com useCarregarAvisos e entrega pelo AvisosContext; as telas leem com useAvisos.
 * Endpoints: GET /consultas (API Java). Ofertas de vaga: só no front (demonstração).
 */
import { useContext } from 'react';
import { AvisosContext, type AvisosValor } from '../context/avisosContexto';
import { useSimulador } from '../context/useSimulador';
import { agora } from '../lib/relogio';
import { listarConsultas } from '../services/api';
import { ofertasDoCidadao, precisaConfirmar } from '../services/regrasAgendamento';
import { useCarregar } from './useCarregar';

/**
 * Busca os avisos de quem está logado. Usado só pelo Celular, que entrega o resultado no AvisosContext.
 * As consultas vêm de listarConsultas() (API Java quando ligada), e não do mock, para não misturar
 * com pessoas de exemplo que tenham o mesmo id de uma conta nova da API.
 * Sem login, não chama a API: não há avisos.
 * @returns confirmações, ofertas, total do sino, estados da busca e recarregar()
 */
export function useCarregarAvisos(): AvisosValor {
  const { estado } = useSimulador();
  const idCidadao = estado.idCidadaoAtual;

  // Regra: o pedido de confirmação aparece só na janela de confirmação (precisaConfirmar, dias úteis antes da consulta).
  // Busca de novo ao entrar ou sair (idCidadao) e quando o mock muda (modo demonstração).
  const { dados, carregando, erro, recarregar } = useCarregar(
    async () => (idCidadao === null ? [] : (await listarConsultas()).filter((c) => c.idCidadao === idCidadao && precisaConfirmar(c, agora()))),
    [idCidadao, estado.consultas],
  );
  // Ofertas da lista do dia buscadas pela conta (ou pela entrada feita sem login).
  const ofertas = ofertasDoCidadao(estado.ofertas, estado.listaDoDia, idCidadao);
  const confirmacoes = idCidadao === null ? [] : dados ?? [];

  return { confirmacoes, ofertas, total: confirmacoes.length + ofertas.length, carregando, erro, recarregar };
}

/**
 * Avisos do cidadão logado, os mesmos contados no sino.
 * Só funciona dentro do Celular (as telas do celular do cidadão).
 */
export function useAvisos(): AvisosValor {
  const contexto = useContext(AvisosContext);
  if (!contexto) throw new Error('useAvisos deve ser usado dentro do Celular.');
  return contexto;
}
