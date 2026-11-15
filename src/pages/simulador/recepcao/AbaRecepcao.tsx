/**
 * Página: aba Recepção UBS (/simulador/recepcao)
 * Vai mostrar o painel da recepção: agenda do dia, balcão, pendentes de confirmação,
 * lista do dia e indicadores. Por enquanto: "Em construção" (bloco 5).
 * Veio do protótipo: telas de src/pages/recepcao.
 * Endpoints (planejados): veja a lista no painel de explicação abaixo.
 * Estados: ainda não se aplica.
 */
import EmConstrucao from '../../../components/EmConstrucao';
import LayoutAba from '../../../components/LayoutAba';
import PainelExplicacao from '../../../components/PainelExplicacao';

/** Aba Recepção UBS: painel da recepção (em construção). */
export default function AbaRecepcao() {
  return (
    <LayoutAba
      explicacao={
        <PainelExplicacao
          titulo="Recepção UBS"
          oQueFaz="Simula o painel da recepção da UBS: agenda do dia, confirmações pendentes, atendimento no balcão, lista do dia e indicadores de faltas."
          regras={[
            'Pendentes de confirmação: risco ALTO de falta primeiro.',
            'Quem não confirma até 1 dia útil antes tem o horário liberado para a lista do dia.',
            'Vaga da lista do dia: oferecida com pelo menos 60 min de antecedência; 30 min para aceitar.',
            'Presença só no dia da consulta; falta só depois do horário.',
          ]}
          endpoints={[
            { metodo: 'GET', rota: '/unidades', api: 'JAVA' },
            { metodo: 'GET', rota: '/unidades/{id}/horarios', api: 'JAVA' },
            { metodo: 'GET', rota: '/consultas', api: 'JAVA' },
            { metodo: 'PUT', rota: '/consultas/{id}/status', api: 'JAVA' },
            { metodo: 'GET', rota: '/cidadaos?cns={nrCns}', api: 'JAVA' },
            { metodo: 'POST', rota: '/cidadaos', api: 'JAVA' },
            { metodo: 'POST', rota: '/consultas', api: 'JAVA' },
            { metodo: 'POST', rota: 'lista do dia e ofertas de vaga', api: 'FRONT' },
          ]}
        />
      }
    >
      <EmConstrucao titulo="Recepção UBS" previsao="bloco 5" />
    </LayoutAba>
  );
}
