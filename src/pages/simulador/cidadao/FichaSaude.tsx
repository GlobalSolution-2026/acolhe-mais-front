/**
 * Página: Ficha de saúde (aba Cidadão → celular, /simulador/cidadao/perfil/ficha)
 * Ficha opcional com doenças de base, medicamentos de uso contínuo, alergias e tipo sanguíneo.
 * Prévia da integração com o Meu SUS (US26): fica só no front.
 * Veio do protótipo: src/pages/cidadao/FichaSaude.tsx.
 * Endpoints: nenhum na API. DEMONSTRAÇÃO: não existe na API Java (/cidadaos/{id}/ficha é prévia).
 * Estados: sem login, carregando, erro ao salvar, "Salvando..." e confirmação antes de apagar.
 * Regra (LGPD, art. 11, dado sensível): só salva com a autorização marcada; a pessoa pode apagar a ficha.
 */
import { useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import AvisoPrevia from '../../../components/AvisoPrevia';
import CampoFormulario from '../../../components/CampoFormulario';
import Loading from '../../../components/Loading';
import MensagemErro from '../../../components/MensagemErro';
import { BOTAO_CONTORNO, BOTAO_EMERGENCIA } from '../../../components/celular/classes';
import PedirLogin from '../../../components/celular/PedirLogin';
import { useSimulador } from '../../../context/useSimulador';
import { DOENCAS_BASE } from '../../../data/contaDemo';
import { useCarregar } from '../../../hooks/useCarregar';
import { fmtDiaHora } from '../../../lib/datas';
import { apagarFicha, buscarFicha, salvarFicha } from '../../../services/api';
import { BASE_CELULAR } from '../../../services/navegacao';
import type { CodigoDoencaBase, FichaSaude, MedicamentoContinuo, TipoSanguineo } from '../../../types';
import { mensagemDoErro } from '../../../utils/erros';
import { formatarTelefone } from '../../../utils/formatadores';

/** Campos do formulário da ficha. */
interface FichaForm {
  dsDoencasBase: CodigoDoencaBase[];
  dsOutraDoenca: string;
  medicamentos: MedicamentoContinuo[];
  dsAlergias: string;
  dsTipoSanguineo: TipoSanguineo;
  flConsentimento: boolean;
}

const TIPOS: TipoSanguineo[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const CAIXA = 'h-5 w-5 accent-primaria';
const BOTAO_SALVAR =
  'flex min-h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-primaria px-5 font-bold text-branco shadow-leve hover:bg-primariaEscura disabled:cursor-not-allowed disabled:opacity-60';

/** Formulário da ficha (aparece depois de carregar a ficha atual). */
function FormularioFicha({ idCidadao, ficha }: { idCidadao: number; ficha: FichaSaude | null }) {
  const { estado } = useSimulador();
  const navigate = useNavigate();
  const cadastro = estado.cidadaos.find((c) => c.idCidadao === idCidadao);
  const [erro, setErro] = useState<string | null>(null);
  const [apagando, setApagando] = useState(false);
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FichaForm>({
    defaultValues: {
      dsDoencasBase: ficha?.dsDoencasBase ?? [],
      dsOutraDoenca: ficha?.dsOutraDoenca ?? '',
      medicamentos: ficha?.medicamentos ?? [],
      dsAlergias: ficha?.dsAlergias ?? '',
      dsTipoSanguineo: ficha?.dsTipoSanguineo ?? '',
      flConsentimento: false,
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'medicamentos' });
  const doencas = useWatch({ control, name: 'dsDoencasBase' });
  const outra = (doencas || []).includes('OUTRA');

  /** Salva a ficha (só os medicamentos com nome) e volta para o Perfil. */
  const enviar = handleSubmit(async (v) => {
    setErro(null);
    try {
      await salvarFicha({
        idCidadao,
        dsDoencasBase: v.dsDoencasBase || [],
        dsOutraDoenca: outra ? v.dsOutraDoenca.trim() : '',
        medicamentos: v.medicamentos
          .filter((m) => m.nmMedicamento.trim())
          .map((m) => ({ nmMedicamento: m.nmMedicamento.trim(), dsDose: m.dsDose.trim() })),
        dsAlergias: v.dsAlergias.trim(),
        dsTipoSanguineo: v.dsTipoSanguineo,
        flConsentimento: v.flConsentimento,
      });
      navigate(`${BASE_CELULAR}/perfil`);
    } catch (e) {
      setErro(mensagemDoErro(e));
    }
  });

  /** Apaga a ficha (direito de exclusão da LGPD) e volta para o Perfil. */
  const apagar = async () => {
    await apagarFicha(idCidadao);
    navigate(`${BASE_CELULAR}/perfil`);
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold text-primaria">Ficha de saúde</h1>
      <AvisoPrevia />
      <p className="text-base text-textoSuave">Opcional. Ajuda quem for socorrer você numa emergência.</p>
      {ficha && <p className="text-sm font-semibold text-textoSuave">Última atualização: {fmtDiaHora(ficha.dtAtualizacao, false)}</p>}
      {erro && <MensagemErro mensagem={erro} />}

      <form onSubmit={enviar} className="flex flex-col gap-5" noValidate>
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 font-semibold">Doenças de base</legend>
          {DOENCAS_BASE.map((d) => (
            <label key={d.cd} className="flex min-h-11 items-center gap-3 rounded-xl border border-borda bg-branco px-3">
              <input type="checkbox" value={d.cd} className={CAIXA} {...register('dsDoencasBase')} /> {d.nm}
            </label>
          ))}
          {outra && <CampoFormulario id="dsOutraDoenca" label="Qual outra doença?" registro={register('dsOutraDoenca')} />}
        </fieldset>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 font-semibold">Medicamentos de uso contínuo</legend>
          {fields.length === 0 && <p className="text-sm text-textoSuave">Nenhum medicamento adicionado.</p>}
          {fields.map((f, i) => (
            <div key={f.id} className="flex flex-col gap-2 rounded-xl border border-borda bg-branco p-3">
              <CampoFormulario id={`med-${i}`} label="Nome do remédio" registro={register(`medicamentos.${i}.nmMedicamento`)} />
              <CampoFormulario id={`dose-${i}`} label="Dose (opcional)" placeholder="Ex.: 50 mg, 1 vez ao dia" registro={register(`medicamentos.${i}.dsDose`)} />
              <button type="button" onClick={() => remove(i)} className={`${BOTAO_CONTORNO} cursor-pointer`}>
                <FiTrash2 aria-hidden /> Remover
              </button>
            </div>
          ))}
          <button type="button" onClick={() => append({ nmMedicamento: '', dsDose: '' })} className={`${BOTAO_CONTORNO} cursor-pointer`}>
            <FiPlus aria-hidden /> Adicionar medicamento
          </button>
        </fieldset>

        <div className="flex flex-col gap-1">
          <label htmlFor="dsAlergias" className="font-semibold">Alergias</label>
          <textarea id="dsAlergias" rows={3} placeholder="Remédios, alimentos..."
            className="w-full rounded-xl border border-borda bg-branco px-4 py-3 text-texto outline-none focus:ring-2 focus:ring-primaria"
            {...register('dsAlergias')} />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="dsTipoSanguineo" className="font-semibold">Tipo sanguíneo (opcional)</label>
          <select id="dsTipoSanguineo" className="min-h-12 w-full rounded-xl border border-borda bg-branco px-4 text-texto outline-none focus:ring-2 focus:ring-primaria"
            {...register('dsTipoSanguineo')}>
            <option value="">Não informar</option>
            {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
            <option value="NAO_SEI">Não sei</option>
          </select>
        </div>

        <div className="rounded-xl bg-mentaSuave p-3">
          <p className="font-semibold">Contato de emergência</p>
          <p>{cadastro?.nmContatoRecado ? `${cadastro.nmContatoRecado} · ${formatarTelefone(cadastro.nrContatoRecado)}` : 'Não informado'}</p>
          <Link to={`${BASE_CELULAR}/perfil/editar`} className="text-sm font-bold text-primaria underline">Alterar no cadastro</Link>
        </div>

        <div>
          <label className="flex items-start gap-3">
            <input type="checkbox" className={`${CAIXA} mt-1 shrink-0`} {...register('flConsentimento', { required: 'É preciso autorizar para salvar a ficha.' })} />
            <span className="font-semibold">Autorizo o uso destes dados de saúde para me orientar no app (LGPD, art. 11)</span>
          </label>
          {errors.flConsentimento && <p className="mt-1 text-sm font-semibold text-gravidade-vermelho">{errors.flConsentimento.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className={BOTAO_SALVAR}>
          {isSubmitting ? 'Salvando...' : 'Salvar ficha'}
        </button>
      </form>

      {ficha &&
        (apagando ? (
          <div className="flex flex-col gap-2 rounded-xl border border-borda bg-branco p-3" role="alertdialog" aria-label="Confirmar exclusão da ficha">
            <p className="font-semibold">Apagar sua ficha de saúde? Esta ação não pode ser desfeita.</p>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setApagando(false)} className={`${BOTAO_CONTORNO} cursor-pointer`}>Cancelar</button>
              <button type="button" onClick={() => void apagar()} className={`${BOTAO_EMERGENCIA} cursor-pointer`}>Sim, apagar</button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => setApagando(true)} className={`${BOTAO_CONTORNO} cursor-pointer`}>
            <FiTrash2 aria-hidden /> Apagar minha ficha
          </button>
        ))}
    </div>
  );
}

/** Tela Ficha de saúde: pede login e carrega a ficha atual antes de mostrar o formulário. */
export default function FichaSaudePagina() {
  const { estado } = useSimulador();
  const idCidadao = estado.idCidadaoAtual;
  const { dados, carregando, erro, recarregar } = useCarregar(
    async () => (idCidadao === null ? null : buscarFicha(idCidadao)),
    [idCidadao],
  );

  if (idCidadao === null) return <PedirLogin mensagem="Entre na sua conta para ver ou editar a ficha de saúde." destino="ficha" />;
  if (carregando) return <Loading />;
  if (erro) return <MensagemErro mensagem={erro} onRetry={recarregar} />;
  return <FormularioFicha idCidadao={idCidadao} ficha={dados} />;
}
