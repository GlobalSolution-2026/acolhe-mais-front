/**
 * Página: aba Cidadão (/simulador/cidadao)
 * Vai mostrar o celular do cidadão: orientação por cor, UBS próximas, horários, login,
 * agendamento, minhas consultas, avisos e perfil. Por enquanto: "Em construção" (blocos 2 a 4).
 * Veio do protótipo: telas de src/pages/cidadao.
 * Endpoints (planejados): veja a lista no painel de explicação abaixo.
 * Estados: ainda não se aplica.
 */
import EmConstrucao from '../../../components/EmConstrucao';
import LayoutAba from '../../../components/LayoutAba';
import PainelExplicacao from '../../../components/PainelExplicacao';

/** Aba Cidadão: celular do app (em construção). */
export default function AbaCidadao() {
  return (
    <LayoutAba
      explicacao={
        <PainelExplicacao
          titulo="Cidadão"
          oQueFaz="Simula o celular de quem usa o Acolhe+: responde perguntas sobre a queixa, recebe uma cor e um destino (SAMU, pronto-socorro, UPA ou UBS) e, nos casos verde e azul, agenda na UBS."
          regras={[
            'A plataforma orienta, não faz diagnóstico.',
            'A verificação de urgência (IA) só pode elevar a cor, nunca baixar.',
            'Agendamento só em dias úteis, sem feriados nacionais.',
            'Nome, Cartão SUS, nascimento e sexo não mudam pelo app (RF27).',
          ]}
          endpoints={[
            { metodo: 'GET', rota: '/unidades', api: 'JAVA' },
            { metodo: 'GET', rota: '/unidades/{id}/horarios', api: 'JAVA' },
            { metodo: 'POST', rota: '/cidadaos', api: 'JAVA' },
            { metodo: 'POST', rota: '/cidadaos/login', api: 'JAVA' },
            { metodo: 'PUT', rota: '/cidadaos/{id}', api: 'JAVA' },
            { metodo: 'POST', rota: '/consultas', api: 'JAVA' },
            { metodo: 'PUT', rota: '/consultas/{id}/status', api: 'JAVA' },
            { metodo: 'POST', rota: '/verificar-urgencia', api: 'FLASK' },
            { metodo: 'POST', rota: '/prever-falta', api: 'FLASK' },
            { metodo: 'GET', rota: '/ws/{cep}/json/', api: 'VIACEP' },
          ]}
        />
      }
    >
      <EmConstrucao titulo="Cidadão" previsao="bloco 2" />
    </LayoutAba>
  );
}
