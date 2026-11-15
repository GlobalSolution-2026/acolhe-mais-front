/**
 * Página: aba Status das APIs (/simulador/status)
 * Vai mostrar um card por API (Java, Flask e ViaCEP) com situação, URL e tempo de resposta,
 * a tabela de endpoints e o painel de requisições ao vivo. Por enquanto: "Em construção" (bloco 6).
 * Veio de: página de status do simulador do Lobo-guará Tech.
 * Endpoints (planejados): GET /unidades (API Java), GET /status (API Flask), GET /ws/{cep}/json/ (ViaCEP).
 * Estados: ainda não se aplica.
 */
import EmConstrucao from '../../../components/EmConstrucao';
import LayoutAba from '../../../components/LayoutAba';
import PainelExplicacao from '../../../components/PainelExplicacao';

/** Aba Status das APIs (em construção). */
export default function AbaStatus() {
  return (
    <LayoutAba
      explicacao={
        <PainelExplicacao
          titulo="Status das APIs"
          oQueFaz="Mostra se cada API está no ar, quanto tempo demora para responder e as últimas chamadas feitas pelo simulador, reais ou de demonstração."
          regras={[
            'Variável de ambiente vazia = API "Não configurada" (o simulador usa os dados de exemplo).',
            'O Render gratuito "dorme": a primeira chamada pode demorar.',
          ]}
          endpoints={[
            { metodo: 'GET', rota: '/unidades', api: 'JAVA' },
            { metodo: 'GET', rota: '/status', api: 'FLASK' },
            { metodo: 'GET', rota: '/ws/{cep}/json/', api: 'VIACEP' },
          ]}
        />
      }
    >
      <EmConstrucao titulo="Status das APIs" previsao="bloco 6" />
    </LayoutAba>
  );
}
