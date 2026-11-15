/**
 * Página: Simulador Acolhe+ (/simulador)
 * Base do simulador: envolve as abas com os contextos do modo demonstração
 * (SimuladorProvider) e do painel de requisições (RequisicoesProvider).
 * O layout com as 5 abas entra no bloco 1.
 * Endpoints: nenhum por enquanto (as abas chamam os serviços de services/).
 * Estados: ainda não se aplica.
 */
import { RequisicoesProvider } from '../context/RequisicoesContext';
import { SimuladorProvider } from '../context/SimuladorContext';
import SeloDemonstracao from '../components/SeloDemonstracao';
import { API_URL } from '../services/api';

/** Página do simulador com os contextos do modo demonstração. */
export default function Simulador() {
  return (
    <RequisicoesProvider>
      <SimuladorProvider>
        <section className="mx-auto flex max-w-5xl flex-col gap-4 px-4 pb-16 pt-32 font-nunito text-texto">
          <h1 className="text-3xl font-extrabold text-primaria">Simulador Acolhe+</h1>
          {!API_URL && <SeloDemonstracao descricao="Sem a URL da API Java, o simulador usa os dados de exemplo do próprio front." />}
        </section>
      </SimuladorProvider>
    </RequisicoesProvider>
  );
}
