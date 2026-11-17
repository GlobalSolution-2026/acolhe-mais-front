import { GRUPOS_ENDPOINTS } from '../../data/endpointsApi';
import { nomeDaTela } from '../../data/telasSimulador';
import BadgeMetodo from '../BadgeMetodo';

/**
 * Endpoints por controller (Unidade, Horário, Cidadão, Consulta, Auth, IA, ViaCEP e "Só no front"),
 * com método, rota, o que cada um faz e as telas do simulador que o chamam.
 * Usa a mesma lista do bloco "Endpoints desta tela" (data/endpointsApi.ts).
 * Em lista (e não em <table>) para caber no celular sem rolar de lado.
 */
export default function TabelaEndpoints() {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-borda bg-branco p-4 shadow-leve">
      <div>
        <h2 className="text-lg font-extrabold text-primaria">Endpoints por controller</h2>
        <p className="text-sm text-textoSuave">
          Sem VITE_API_URL ou VITE_FLASK_URL, as mesmas chamadas respondem em modo demonstração. O grupo "Só no front"
          ainda não existe em nenhuma API.
        </p>
      </div>
      {GRUPOS_ENDPOINTS.map((grupo) => (
        <div key={grupo.nome} className="flex flex-col gap-2">
          <h3 className="font-extrabold">{grupo.nome}</h3>
          <ul className="flex flex-col divide-y divide-borda rounded-xl border border-borda">
            {grupo.endpoints.map((e) => (
              <li key={`${e.metodo} ${e.rota}`} className="flex flex-col gap-1 p-3 md:flex-row md:gap-3">
                <div className="flex items-center gap-2 md:w-72 md:shrink-0 md:self-start">
                  <BadgeMetodo metodo={e.metodo} />
                  <code className="break-all font-mono text-sm">{e.rota}</code>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm">{e.descricao}</p>
                  <p className="text-xs text-textoSuave">Telas: {e.telas.map(nomeDaTela).join(', ')}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
