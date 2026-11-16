/**
 * Página: aba Status das APIs (/simulador/status)
 * Um card por API (Java, Flask e ViaCEP) com situação (Online, Fora do ar, Não configurada ou Demonstração),
 * URL, tempo de resposta e horário da última verificação; a lista de endpoints por controller com a tela
 * onde cada um é usado; e o painel de requisições ao vivo.
 * Veio de: página de status do simulador do Lobo-guará Tech (não há tela equivalente no protótipo).
 * Endpoints: GET /unidades (API Java), GET /status (API Flask) e GET /ws/01310100/json/ (ViaCEP).
 * Estados: verificando, online, fora do ar (com a mensagem do erro), não configurada e demonstração;
 * painel de requisições vazio.
 */
import { useState } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import LayoutAba from '../../../components/LayoutAba';
import PainelExplicacao from '../../../components/PainelExplicacao';
import CardApi from '../../../components/status/CardApi';
import PainelRequisicoes from '../../../components/status/PainelRequisicoes';
import TabelaEndpoints from '../../../components/status/TabelaEndpoints';
import { API_URL, listarUnidades } from '../../../services/api';
import { buscarEndereco, VIACEP_URL } from '../../../services/cep';
import { FLASK_URL, verificarStatusFlask } from '../../../services/ia';

/** CEP fixo usado para conferir o ViaCEP (Avenida Paulista). */
const CEP_TESTE = '01310100';

/** Aba Status das APIs. */
export default function AbaStatus() {
  // Muda a cada "Verificar agora": os três cards verificam de novo.
  const [rodada, setRodada] = useState(0);

  return (
    <LayoutAba
      explicacao={
        <PainelExplicacao
          titulo="Status das APIs"
          oQueFaz="Mostra se cada API está no ar, quanto tempo demora para responder e as últimas chamadas feitas pelo simulador, reais ou de demonstração."
          regras={[
            'Variável de ambiente vazia = API "Não configurada": o simulador usa os dados de exemplo (modo demonstração).',
            'O Render gratuito "dorme" depois de um tempo sem uso: a primeira chamada pode levar até um minuto.',
            'Lista do dia, ofertas de vaga, orientação salva e ficha de saúde ficam só no front por enquanto.',
          ]}
          endpoints={[
            { metodo: 'GET', rota: '/unidades', api: 'JAVA' },
            { metodo: 'GET', rota: '/status', api: 'FLASK' },
            { metodo: 'GET', rota: `/ws/${CEP_TESTE}/json/`, api: 'VIACEP' },
          ]}
        />
      }
    >
      <div className="flex flex-col gap-4">
        <section className="flex flex-col gap-3 rounded-xl border border-borda bg-branco p-4 shadow-leve md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-primaria">Status das APIs</h1>
            <p className="text-sm text-textoSuave">
              As APIs ficam no Render gratuito, que "dorme" sem uso: a primeira verificação pode demorar.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setRodada((r) => r + 1)}
            className="flex min-h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primaria px-5 font-bold text-branco shadow-leve hover:bg-primariaEscura"
          >
            <FiRefreshCw aria-hidden /> Verificar agora
          </button>
        </section>

        <div className="grid gap-4 xl:grid-cols-3">
          <CardApi nome="API Java" url={API_URL} variavel="VITE_API_URL" rotaVerificacao="GET /unidades" verificar={() => listarUnidades()} rodada={rodada} />
          <CardApi nome="API Flask (IA)" url={FLASK_URL} variavel="VITE_FLASK_URL" rotaVerificacao="GET /status" verificar={verificarStatusFlask} rodada={rodada} />
          <CardApi nome="ViaCEP" url={VIACEP_URL} rotaVerificacao={`GET /ws/${CEP_TESTE}/json/`} verificar={() => buscarEndereco(CEP_TESTE)} rodada={rodada} />
        </div>

        <PainelRequisicoes />
        <TabelaEndpoints />
      </div>
    </LayoutAba>
  );
}
