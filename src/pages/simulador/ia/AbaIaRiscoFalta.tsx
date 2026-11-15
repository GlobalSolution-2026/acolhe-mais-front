/**
 * Página: aba IA – Risco de falta (/simulador/ia-risco-falta)
 * Vai mostrar o Modelo 1: formulário com os atributos, probabilidade de falta, risco BAIXO/ALTO
 * e a consequência na confirmação. Por enquanto: "Em construção" (bloco 7).
 * Veio de: planejamento do grupo (não há tela equivalente no protótipo).
 * Endpoints (planejados): POST /prever-falta (API Flask).
 * Estados: ainda não se aplica.
 */
import EmConstrucao from '../../../components/EmConstrucao';
import LayoutAba from '../../../components/LayoutAba';
import PainelExplicacao from '../../../components/PainelExplicacao';

/** Aba IA – Risco de falta (em construção). */
export default function AbaIaRiscoFalta() {
  return (
    <LayoutAba
      explicacao={
        <PainelExplicacao
          titulo="IA – Risco de falta"
          oQueFaz="Mostra o Modelo 1, que estima a probabilidade de a pessoa faltar à consulta a partir de idade, sexo, antecedência, dia da semana, SMS e faltas anteriores."
          regras={[
            'Risco ALTO a partir de 0,60 de probabilidade.',
            'Risco BAIXO: pedido de confirmação 2 dias úteis antes; ALTO: 3 dias úteis antes, com lembrete.',
            'Nesta versão, smsRecebido vai sempre como false e o bairro não é enviado.',
          ]}
          endpoints={[{ metodo: 'POST', rota: '/prever-falta', api: 'FLASK' }]}
        />
      }
    >
      <EmConstrucao titulo="IA – Risco de falta" previsao="bloco 7" />
    </LayoutAba>
  );
}
