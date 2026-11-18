import { useState } from 'react';
import { FiClock, FiSunset } from 'react-icons/fi';
import { useSimulador } from '../../context/useSimulador';
import { API_URL } from '../../services/api';
import type { ResumoSimulacao } from '../../services/simulacao';

/** "1 consulta liberada" / "2 consultas liberadas". */
const plural = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`;

const BOTAO =
  'flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-borda bg-branco px-4 font-bold text-primaria shadow-leve hover:bg-mentaSuave disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-branco';

/**
 * Botões do modo demonstração da recepção (veio do protótipo, ModoDemonstracao):
 * fazem o tempo "passar" para mostrar as regras sem esperar dias.
 * DEMONSTRAÇÃO: não existe na API Java.
 * "Simular prazo" libera consultas do mock: com a API ligada ele fica desativado, porque as consultas
 * da tela são as do banco e a liberação por prazo é responsabilidade da API.
 */
export default function ModoDemonstracaoRecepcao() {
  const { simularPassagemPrazo, vencerPrazoOfertas, encerrarDia } = useSimulador();
  const [resumo, setResumo] = useState<ResumoSimulacao | null>(null);
  const [diaEncerrado, setDiaEncerrado] = useState(false);

  return (
    <section className="flex flex-col gap-3 rounded-xl border-2 border-dashed border-primaria/40 bg-mentaSuave p-4">
      <div>
        <h2 className="font-extrabold text-primaria">Modo demonstração</h2>
        <p className="text-sm text-textoSuave">Só para a apresentação: faz o tempo passar para mostrar as regras.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="flex flex-col gap-1">
          <button
            type="button"
            className={BOTAO}
            disabled={!!API_URL}
            aria-describedby="ajuda-simular-prazo"
            onClick={() => setResumo(simularPassagemPrazo())}
          >
            <FiClock aria-hidden /> Simular prazo
          </button>
          <p id="ajuda-simular-prazo" className="text-sm text-textoSuave">
            {API_URL
              ? 'Com a API ligada, a liberação por prazo é feita pela API.'
              : 'Libera as consultas não confirmadas dos próximos 3 dias com atendimento desta UBS e oferece as vagas à lista do dia.'}
          </p>
          {resumo && (
            <p className="text-sm font-bold text-primaria" role="status">
              {resumo.consultasLiberadas + resumo.mantidasSemContato === 0
                ? 'Nenhuma consulta não confirmada no período.'
                : `${plural(resumo.consultasLiberadas, 'consulta liberada', 'consultas liberadas')} · ${plural(resumo.vagasOferecidas, 'vaga oferecida', 'vagas oferecidas')} · ${plural(resumo.mantidasSemContato, 'mantida (sem contato)', 'mantidas (sem contato)')}`}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <button type="button" className={BOTAO} onClick={vencerPrazoOfertas}>
            <FiClock aria-hidden /> Vencer ofertas agora
          </button>
          <p className="text-sm text-textoSuave">Vence as ofertas de vaga pendentes; cada vaga vai para o próximo da fila.</p>
        </div>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            className={BOTAO}
            onClick={() => {
              encerrarDia();
              setDiaEncerrado(true);
            }}
          >
            <FiSunset aria-hidden /> Encerrar o dia
          </button>
          <p className="text-sm text-textoSuave">Quem não foi encaixado ganha prioridade no próximo dia.</p>
          {diaEncerrado && <p className="text-sm font-bold text-primaria" role="status">Dia encerrado: a fila ganhou prioridade.</p>}
        </div>
      </div>
    </section>
  );
}
