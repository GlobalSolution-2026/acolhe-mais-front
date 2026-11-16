/**
 * Página: Início (aba Cidadão → celular, /simulador/cidadao/inicio)
 * Primeira tela do app: a pessoa informa o CEP (o ViaCEP completa o endereço), pode digitar número
 * e complemento e escolhe uma das 5 queixas para começar a orientação. A Emergência fica no botão
 * vermelho da barra inferior do celular, sempre visível.
 * Veio do protótipo: src/pages/cidadao/Inicio.tsx.
 * Endpoints: GET https://viacep.com.br/ws/{cep}/json/ (API externa).
 * Estados: buscando endereço, endereço encontrado, CEP não encontrado e falha do ViaCEP.
 * Regra: o endereço é só um complemento; a busca nunca bloqueia a orientação (pode ser urgência).
 */
import { useEffect, useState, type ChangeEvent } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { IconType } from 'react-icons';
import { FiDroplet, FiFrown, FiThermometer, FiWind, FiZap } from 'react-icons/fi';
import CampoFormulario from '../../../components/CampoFormulario';
import LegendaCores from '../../../components/LegendaCores';
import { useSimulador } from '../../../context/useSimulador';
import { queixas } from '../../../data/queixas';
import { buscarEndereco, formatarEndereco } from '../../../services/cep';
import { BASE_CELULAR } from '../../../services/navegacao';
import type { CodigoQueixa, EnderecoCep } from '../../../types/orientacao';
import { regrasCep } from '../../../utils/validacoes';

/** Campos do formulário do Início. */
interface FormInicio {
  cep: string;
  nrEndereco: string;
  dsComplemento: string;
}

/** Resultado da busca no ViaCEP para um CEP. */
interface BuscaCep {
  cep: string;
  status: 'OK' | 'NAO_ENCONTRADO' | 'FALHA';
  endereco: EnderecoCep | null;
}

/** Ícone de cada queixa. */
const ICONES: Record<CodigoQueixa, IconType> = {
  GRIPAL: FiThermometer,
  GARGANTA: FiWind,
  DIARREIA: FiDroplet,
  CABECA: FiFrown,
  URINA: FiZap,
};

/** Formata o CEP enquanto a pessoa digita: "04010100" → "04010-100". */
function mascararCep(valor: string): string {
  const d = valor.replace(/\D/g, '').slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

/** Tela Início do celular: CEP, queixas e acesso à Emergência. */
export default function Inicio() {
  const { estado, iniciarOrientacao } = useSimulador();
  const navigate = useNavigate();
  const { register, control, handleSubmit, setValue, formState: { errors, isSubmitted } } = useForm<FormInicio>({
    // Volta com o que a pessoa já tinha digitado numa orientação anterior.
    defaultValues: {
      cep: estado.orientacaoAtual?.nrCep ?? '',
      nrEndereco: estado.orientacaoAtual?.nrEndereco ?? '',
      dsComplemento: estado.orientacaoAtual?.dsComplemento ?? '',
    },
  });
  const cep = useWatch({ control, name: 'cep' });
  const cepCompleto = /^\d{5}-\d{3}$/.test(cep ?? '');

  // Resultado da última busca; só vale para o CEP que está no campo agora.
  const [busca, setBusca] = useState<BuscaCep | null>(null);
  const buscaAtual = cepCompleto && busca?.cep === cep ? busca : null;

  // Busca o endereço quando o CEP fica completo. Se a pessoa trocar o CEP, a busca antiga é cancelada.
  useEffect(() => {
    if (!cepCompleto) return;
    const controle = new AbortController();
    buscarEndereco(cep, controle.signal)
      .then((endereco) => {
        if (!controle.signal.aborted) setBusca({ cep, endereco, status: endereco ? 'OK' : 'NAO_ENCONTRADO' });
      })
      .catch(() => {
        if (!controle.signal.aborted) setBusca({ cep, endereco: null, status: 'FALHA' });
      });
    return () => controle.abort();
  }, [cep, cepCompleto]);

  /** Valida o CEP, guarda a queixa e o endereço no Context e abre as perguntas. */
  const escolher = (codigo: CodigoQueixa) =>
    handleSubmit(({ cep: nrCep, nrEndereco, dsComplemento }) => {
      iniciarOrientacao(codigo, nrCep, {
        endereco: buscaAtual?.endereco ?? null,
        nrEndereco: nrEndereco.trim(),
        dsComplemento: dsComplemento.trim(),
      });
      navigate(`${BASE_CELULAR}/orientacao`);
    })();

  const registroCep = register('cep', {
    ...regrasCep,
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      setValue('cep', mascararCep(e.target.value), { shouldValidate: isSubmitted });
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <CampoFormulario id="cep" label="Seu CEP" placeholder="00000-000" numerico registro={registroCep} erro={errors.cep} />
        {cepCompleto && (
          <p className="text-sm text-textoSuave" aria-live="polite">
            {!buscaAtual && 'Buscando endereço...'}
            {buscaAtual?.endereco && formatarEndereco(buscaAtual.endereco)}
            {buscaAtual?.status === 'NAO_ENCONTRADO' && 'Não encontramos este CEP, mas você pode continuar.'}
            {buscaAtual?.status === 'FALHA' && 'Não foi possível buscar o endereço agora. Você pode continuar só com o CEP.'}
          </p>
        )}
        <div className="grid grid-cols-[1fr_2fr] gap-3">
          <CampoFormulario id="nrEndereco" label="Número" placeholder="Opcional" registro={register('nrEndereco', { maxLength: 10 })} />
          <CampoFormulario id="dsComplemento" label="Complemento" placeholder="Opcional" registro={register('dsComplemento', { maxLength: 60 })} />
        </div>
      </div>

      <div>
        <h1 className="mb-1 text-2xl font-extrabold text-primaria">O que você está sentindo?</h1>
        {!cepCompleto && <p className="text-base text-textoSuave">Preencha o CEP para escolher.</p>}
      </div>

      <div className="grid gap-3">
        {queixas.map((q) => {
          const Icone = ICONES[q.codigo];
          return (
            <button
              key={q.codigo}
              type="button"
              onClick={() => escolher(q.codigo)}
              aria-disabled={!cepCompleto}
              className={`flex min-h-20 items-center gap-4 rounded-xl border border-borda bg-branco p-4 text-left text-lg font-bold shadow-leve transition-colors ${
                cepCompleto ? 'cursor-pointer hover:border-primaria' : 'opacity-50'
              }`}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-mentaSuave text-primaria">
                <Icone size={26} aria-hidden />
              </span>
              {q.nmQueixa}
            </button>
          );
        })}
      </div>

      {/* Legenda das cores (acessibilidade): número, significado e destino de cada cor */}
      <LegendaCores />
    </div>
  );
}
