import type { ReactNode } from 'react';
import type { MetodoHttp, NomeApi } from '../types';
import BadgeMetodo from './BadgeMetodo';

/** Um endpoint usado pela tela, para listar no painel. */
export interface EndpointExplicado {
  metodo: MetodoHttp;
  rota: string;
  api: NomeApi;
}

interface PainelExplicacaoProps {
  /** Nome da tela (ex.: "Horários da UBS"). */
  titulo: string;
  /** O que a tela faz, em linguagem simples. */
  oQueFaz: ReactNode;
  /** Regras de negócio envolvidas (uma por item). */
  regras?: string[];
  /** Endpoints chamados pela tela. */
  endpoints?: EndpointExplicado[];
}

/** Nome de cada API como aparece no painel. */
const NOME_API: Record<NomeApi, string> = {
  JAVA: 'API Java',
  FLASK: 'API Flask (IA)',
  VIACEP: 'ViaCEP',
  FRONT: 'Só no front (demonstração)',
};

/**
 * Painel ao lado de cada aba do simulador (embaixo, no celular) explicando
 * o que a tela faz, as regras de negócio e os endpoints usados.
 */
export default function PainelExplicacao({ titulo, oQueFaz, regras = [], endpoints = [] }: PainelExplicacaoProps) {
  return (
    <aside className="flex flex-col gap-4 rounded-xl border border-borda bg-branco p-5 font-nunito text-texto shadow-leve">
      <h2 className="text-lg font-extrabold text-primaria">{titulo}</h2>

      <section>
        <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-textoSuave">O que esta tela faz</h3>
        <div className="leading-relaxed">{oQueFaz}</div>
      </section>

      {regras.length > 0 && (
        <section>
          <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-textoSuave">Regras de negócio</h3>
          <ul className="flex list-disc flex-col gap-1 pl-5">
            {regras.map((regra) => (
              <li key={regra}>{regra}</li>
            ))}
          </ul>
        </section>
      )}

      {endpoints.length > 0 && (
        <section>
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-textoSuave">Endpoints</h3>
          <ul className="flex flex-col gap-2">
            {endpoints.map((e) => (
              <li key={`${e.metodo} ${e.rota}`} className="flex flex-wrap items-center gap-2">
                <BadgeMetodo metodo={e.metodo} />
                <code className="break-all font-mono text-sm">{e.rota}</code>
                <span className="text-xs text-textoSuave">{NOME_API[e.api]}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  );
}
