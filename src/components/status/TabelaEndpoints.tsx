import { GRUPOS_ENDPOINTS } from '../../data/endpointsApi';
import BadgeMetodo from '../BadgeMetodo';

/**
 * Endpoints por controller (Unidade, Horário, Cidadão, Consulta, Auth, IA e ViaCEP), com método, rota
 * e em que tela do simulador cada um é usado. Em lista (e não em <table>) para caber no celular sem rolar de lado.
 */
export default function TabelaEndpoints() {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-borda bg-branco p-4 shadow-leve">
      <div>
        <h2 className="text-lg font-extrabold text-primaria">Endpoints por controller</h2>
        <p className="text-sm text-textoSuave">Sem VITE_API_URL ou VITE_FLASK_URL, as mesmas chamadas respondem em modo demonstração.</p>
      </div>
      {GRUPOS_ENDPOINTS.map((grupo) => (
        <div key={grupo.nome} className="flex flex-col gap-2">
          <h3 className="font-extrabold">{grupo.nome}</h3>
          <ul className="flex flex-col divide-y divide-borda rounded-xl border border-borda">
            {grupo.endpoints.map((e) => (
              <li key={`${e.metodo} ${e.rota}`} className="flex flex-col gap-1 p-3 md:flex-row md:items-center md:gap-3">
                <div className="flex items-center gap-2 md:w-72 md:shrink-0">
                  <BadgeMetodo metodo={e.metodo} />
                  <code className="break-all font-mono text-sm">{e.rota}</code>
                </div>
                <p className="text-sm text-textoSuave">{e.onde}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
