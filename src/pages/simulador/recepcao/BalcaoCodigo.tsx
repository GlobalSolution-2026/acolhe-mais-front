/**
 * Parte do Balcão: busca a orientação pelo código que a pessoa mostra (feita no app).
 * Veio do protótipo: src/pages/recepcao/BalcaoCodigo.tsx.
 * Endpoints: nenhum na API. DEMONSTRAÇÃO: a orientação salva não existe na API Java.
 * Estados: "Buscando...", código não encontrado (404), código vencido e código já utilizado.
 * Regras: o código vale só no dia da orientação e só uma vez (se já gerou consulta, está usado).
 */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiClipboard } from 'react-icons/fi';
import CampoFormulario from '../../../components/CampoFormulario';
import MensagemErro from '../../../components/MensagemErro';
import { BOTAO_PRIMARIO } from '../../../components/celular/classes';
import { useSimulador } from '../../../context/useSimulador';
import { fmtDia } from '../../../lib/datas';
import { agora } from '../../../lib/relogio';
import { buscarOrientacao } from '../../../services/api';
import { avaliarCodigo, type OrientacaoBalcao } from '../../../services/balcao';
import type { Orientacao } from '../../../types/orientacao';
import { mensagemDoErro } from '../../../utils/erros';

interface BalcaoCodigoProps {
  /** Código válido: segue com a orientação (o Balcão decide pela cor). */
  onSeguir: (dados: OrientacaoBalcao) => void;
  /** Código vencido: atalho para fazer a orientação ali mesmo. */
  onFazerAqui: () => void;
}

/** Formulário do código da orientação. */
export default function BalcaoCodigo({ onSeguir, onFazerAqui }: BalcaoCodigoProps) {
  const { obterEstado } = useSimulador();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ codigo: string }>();
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<{ tipo: 'VENCIDA' | 'JA_UTILIZADA'; orientacao: Orientacao } | null>(null);

  /** Busca o código e confere se ainda vale. */
  const buscar = handleSubmit(async ({ codigo }) => {
    setErro(null);
    setAviso(null);
    try {
      const o = await buscarOrientacao(Number(codigo));
      const r = avaliarCodigo(o.idOrientacao, [o], obterEstado().consultas, agora());
      if (r.tipo === 'VENCIDA' || r.tipo === 'JA_UTILIZADA') setAviso(r);
      else if (r.tipo === 'INEXISTENTE') setErro('Código não encontrado. Confira o número com o cidadão.');
      else onSeguir({ orientacao: r.orientacao, sinais: [] });
    } catch (e) {
      setErro(mensagemDoErro(e));
    }
  });

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={buscar} className="flex flex-col gap-3" noValidate>
        <CampoFormulario id="codigo" label="Código da orientação" placeholder="Ex.: 37" numerico erro={errors.codigo}
          registro={register('codigo', {
            required: 'Informe o código.',
            pattern: { value: /^\d{1,9}$/, message: 'O código tem só números.' },
          })} />
        <button type="submit" disabled={isSubmitting} className={`${BOTAO_PRIMARIO} cursor-pointer disabled:opacity-60`}>
          {isSubmitting ? 'Buscando...' : 'Buscar código'}
        </button>
      </form>
      {erro && <MensagemErro mensagem={erro} />}
      {aviso?.tipo === 'VENCIDA' && (
        <div className="flex flex-col gap-3 rounded-xl border border-borda bg-branco p-4" role="alert">
          <p className="font-extrabold text-primaria">Orientação vencida</p>
          <p>O código vale só no dia da orientação ({fmtDia(aviso.orientacao.dtOrientacao, false)}).</p>
          <button type="button" onClick={onFazerAqui} className={`${BOTAO_PRIMARIO} cursor-pointer`}>
            <FiClipboard aria-hidden /> Fazer a orientação aqui
          </button>
        </div>
      )}
      {aviso?.tipo === 'JA_UTILIZADA' && (
        <p className="rounded-xl bg-mentaSuave p-3 font-bold text-primaria" role="alert">Código já utilizado.</p>
      )}
    </div>
  );
}
