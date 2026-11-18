import type { ChangeEvent } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import type { CidadaoEntrada } from '../../types';
import { formatarCep, formatarCns, formatarData, mascararCep } from '../../utils/formatadores';
import {
  regrasCartaoSus, regrasCelular, regrasCep, regrasDataNascimento, regrasNome, regrasSenha, regrasSexo,
} from '../../utils/validacoes';
import CampoFormulario from '../CampoFormulario';

/** Campos do formulário (texto, como o usuário digita). */
interface CidadaoForm {
  nmCidadao: string;
  nrCns: string;
  nrCelular: string;
  dtNascimento: string;
  dsSexo: '' | 'F' | 'M';
  nmContatoRecado: string;
  nrContatoRecado: string;
  nrCep: string;
  senha: string;
  senhaConfirmacao: string;
  semTelefone: boolean;
}

/** Dados que o formulário entrega (sem tpAcesso: quem chama sabe se é conta com senha ou balcão). */
export type DadosCidadao = Omit<CidadaoEntrada, 'tpAcesso' | 'senha'>;

interface FormularioCidadaoProps {
  /** Valores para começar preenchido (cadastro atual no perfil e no agendamento). */
  valoresIniciais?: Partial<DadosCidadao>;
  /** CEP usado quando o formulário não mostra o campo (ex.: o CEP do Início). */
  nrCep?: string;
  aoEnviar: (dados: DadosCidadao, senha?: string) => void;
  /** Criar conta: pede senha e confirmação. */
  pedirSenha?: boolean;
  /**
   * Mostra o campo de CEP, obrigatório (Editar perfil, Criar conta e Agendar quando o cadastro está sem CEP).
   * Começa com valoresIniciais.nrCep ou, se estiver vazio, com o nrCep (ex.: o CEP do Início).
   * Funciona junto com identificacaoSomenteLeitura: o CEP não faz parte da identificação do RF27.
   */
  pedirCep?: boolean;
  /** Balcão: permite cadastro sem celular ("Não tem telefone"). No app, o celular é obrigatório. */
  celularOpcional?: boolean;
  /** RF27: nome, Cartão SUS, nascimento e sexo só para leitura (perfil e agendamento no app). */
  identificacaoSomenteLeitura?: boolean;
  textoBotao: string;
  /** true enquanto a chamada está em andamento: o botão fica desabilitado. */
  enviando: boolean;
  /** Texto do botão enquanto envia (ex.: "Agendando..."). */
  textoEnviando?: string;
}

/** Aviso do RF27 mostrado junto da identificação só para leitura. */
export const AVISO_IDENTIFICACAO =
  'Para corrigir o Cartão SUS, a data de nascimento, o nome ou o sexo, procure a recepção da sua UBS.';

const SEXOS: Record<string, string> = { F: 'Feminino', M: 'Masculino' };

/** Classe do botão de enviar (mesmo visual do Botao, variante simulador). */
const BOTAO_ENVIAR =
  'flex min-h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-primaria px-5 font-bold text-branco shadow-leve hover:bg-primariaEscura disabled:cursor-not-allowed disabled:opacity-60';

/** Telefone opcional: vazio ou 10/11 números com DDD. */
const telefoneOpcional = (v: string) => !v.trim() || /^\d{10,11}$/.test(v.replace(/\D/g, '')) || 'Telefone inválido: use DDD + número.';

/** Regra: a data de nascimento precisa estar no passado (a API Java também valida). */
const nascimentoNoPassado = (v: string) => !v || new Date(`${v}T00:00:00`) < new Date() || 'A data de nascimento deve estar no passado.';

/** RF27: identificação do cadastro mostrada só para leitura, com o aviso de onde corrigir. */
function DadosIdentificacao({ v }: { v: Partial<DadosCidadao> }) {
  const linhas: [string, string][] = [
    ['Nome completo', v.nmCidadao ?? ''],
    ['Cartão SUS', v.nrCns ? formatarCns(v.nrCns) : ''],
    ['Data de nascimento', v.dtNascimento ? formatarData(v.dtNascimento.slice(0, 10)) : ''],
    ['Sexo', SEXOS[v.dsSexo ?? ''] ?? ''],
  ];
  return (
    <section aria-label="Dados de identificação" className="flex flex-col gap-3 rounded-xl border border-borda bg-branco p-4">
      <dl className="flex flex-col gap-2">
        {linhas.map(([rotulo, valor]) => (
          <div key={rotulo}>
            <dt className="text-sm text-textoSuave">{rotulo}</dt>
            <dd className="font-semibold">{valor || '—'}</dd>
          </div>
        ))}
      </dl>
      <p className="text-sm text-textoSuave">{AVISO_IDENTIFICACAO}</p>
    </section>
  );
}

/**
 * Formulário de cadastro do cidadão (react-hook-form). Veio do protótipo (FormularioCidadao).
 * Usado em Criar conta, Agendar, Editar perfil e, no bloco 5, no balcão da recepção.
 * As validações vêm de utils/validacoes.ts (as mesmas regras da API Java).
 */
export default function FormularioCidadao({
  valoresIniciais = {}, nrCep = '', aoEnviar, pedirSenha, pedirCep, celularOpcional,
  identificacaoSomenteLeitura, textoBotao, enviando, textoEnviando = 'Aguarde...',
}: FormularioCidadaoProps) {
  const { register, handleSubmit, getValues, setValue, control, formState: { errors, isSubmitted } } = useForm<CidadaoForm>({
    defaultValues: {
      nmCidadao: valoresIniciais.nmCidadao ?? '',
      nrCns: valoresIniciais.nrCns ?? '',
      nrCelular: valoresIniciais.nrCelular ?? '',
      dtNascimento: valoresIniciais.dtNascimento?.slice(0, 10) ?? '',
      dsSexo: valoresIniciais.dsSexo ?? '',
      nmContatoRecado: valoresIniciais.nmContatoRecado ?? '',
      nrContatoRecado: valoresIniciais.nrContatoRecado ?? '',
      nrCep: valoresIniciais.nrCep ? formatarCep(valoresIniciais.nrCep) : formatarCep(nrCep),
      senha: '',
      senhaConfirmacao: '',
      // Cadastro do balcão já conferido sem celular chega com "Não tem telefone" marcado.
      semTelefone: Boolean(celularOpcional) && valoresIniciais.nrCelular === '',
    },
  });
  const marcouSemTelefone = useWatch({ control, name: 'semTelefone' });
  const recado = useWatch({ control, name: 'nrContatoRecado' }) ?? '';
  const semTelefone = Boolean(celularOpcional) && marcouSemTelefone;

  /**
   * Registra o CEP com a máscara 00000-000 enquanto a pessoa digita (a mesma do Início).
   * Só é chamado quando o campo aparece: registrado sem aparecer, o "obrigatório" travaria o envio.
   */
  const registrarCep = () => register('nrCep', {
    ...regrasCep,
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      setValue('nrCep', mascararCep(e.target.value), { shouldValidate: isSubmitted });
    },
  });

  /** Junta os campos (só com números em CNS, telefones e CEP) e entrega para a tela. */
  const enviar = handleSubmit((v) => {
    const base = identificacaoSomenteLeitura ? valoresIniciais : v;
    aoEnviar(
      {
        nmCidadao: (base.nmCidadao ?? '').trim(),
        nrCns: (base.nrCns ?? '').replace(/\D/g, ''),
        nrCpf: valoresIniciais.nrCpf ?? null,
        dtNascimento: (base.dtNascimento ?? '').slice(0, 10),
        dsSexo: (base.dsSexo || 'F') as 'F' | 'M',
        nrCelular: semTelefone ? '' : v.nrCelular.replace(/\D/g, ''),
        nmContatoRecado: v.nmContatoRecado.trim(),
        nrContatoRecado: v.nrContatoRecado.replace(/\D/g, ''),
        // Com o campo na tela, vale o que a pessoa digitou; sem o campo, o CEP do cadastro ou o recebido.
        nrCep: (pedirCep ? v.nrCep : valoresIniciais.nrCep ?? nrCep).replace(/\D/g, ''),
      },
      pedirSenha ? v.senha : undefined,
    );
  });

  return (
    <form onSubmit={enviar} className="flex flex-col gap-4" noValidate>
      {identificacaoSomenteLeitura ? (
        <DadosIdentificacao v={valoresIniciais} />
      ) : (
        <>
          <CampoFormulario id="nmCidadao" label="Nome completo" erro={errors.nmCidadao} registro={register('nmCidadao', regrasNome)} />
          <CampoFormulario id="nrCns" label="Cartão SUS (15 números)" placeholder="000000000000000" numerico erro={errors.nrCns}
            registro={register('nrCns', regrasCartaoSus)} />
        </>
      )}

      {celularOpcional && (
        <label className="flex min-h-12 items-center gap-3 font-semibold">
          <input type="checkbox" className="h-5 w-5 accent-primaria" {...register('semTelefone')} />
          Não tem telefone
        </label>
      )}
      {!semTelefone && (
        <CampoFormulario id="nrCelular" label="Celular com DDD (só números)" placeholder="11900000000" numerico erro={errors.nrCelular}
          registro={register('nrCelular', {
            // Sem "Não tem telefone", vale a regra do grupo (10 ou 11 números com DDD).
            validate: (v) => {
              if (celularOpcional && getValues('semTelefone')) return true;
              if (!v.trim()) return regrasCelular.required;
              return regrasCelular.pattern.value.test(v.replace(/\D/g, '')) || regrasCelular.pattern.message;
            },
          })} />
      )}

      {!identificacaoSomenteLeitura && (
        <>
          <CampoFormulario id="dtNascimento" label="Data de nascimento" tipo="date" erro={errors.dtNascimento}
            registro={register('dtNascimento', { ...regrasDataNascimento, validate: nascimentoNoPassado })} />
          <div className="flex flex-col gap-1">
            <label htmlFor="dsSexo" className="font-semibold">Sexo</label>
            <select
              id="dsSexo"
              aria-invalid={!!errors.dsSexo}
              className={`min-h-12 w-full rounded-xl border bg-branco px-4 text-texto outline-none focus:ring-2 focus:ring-primaria ${errors.dsSexo ? 'border-gravidade-vermelho' : 'border-borda'}`}
              {...register('dsSexo', regrasSexo)}
            >
              <option value="">Selecione</option>
              <option value="F">Feminino</option>
              <option value="M">Masculino</option>
            </select>
            {errors.dsSexo && <p className="text-sm font-semibold text-gravidade-vermelho">{errors.dsSexo.message}</p>}
          </div>
        </>
      )}

      <CampoFormulario id="nmContatoRecado" label="Contato de recado (opcional)" placeholder="Nome de alguém próximo"
        registro={register('nmContatoRecado', { maxLength: { value: 100, message: 'Use até 100 letras.' } })} erro={errors.nmContatoRecado} />
      <CampoFormulario id="nrContatoRecado" label="Telefone do contato de recado (opcional)" placeholder="11900000000" numerico
        erro={errors.nrContatoRecado} registro={register('nrContatoRecado', { validate: telefoneOpcional })} />

      {pedirCep && (
        <CampoFormulario id="nrCepCadastro" label="CEP" placeholder="00000-000" numerico erro={errors.nrCep} registro={registrarCep()} />
      )}

      {/* Regra: sem telefone e sem recado, a confirmação é presencial e a vaga não é liberada sozinha. */}
      {semTelefone && !recado.trim() && (
        <p className="rounded-xl bg-mentaSuave p-3 text-sm font-semibold text-primaria" role="status">
          Sem telefone e sem contato de recado: a confirmação será presencial e a vaga não é liberada automaticamente.
        </p>
      )}

      {pedirSenha && (
        <>
          <CampoFormulario id="senha" label="Senha (mínimo 6 caracteres)" tipo="password" alternarSenha erro={errors.senha}
            registro={register('senha', regrasSenha)} />
          <CampoFormulario id="senhaConfirmacao" label="Confirme a senha" tipo="password" alternarSenha erro={errors.senhaConfirmacao}
            registro={register('senhaConfirmacao', {
              required: 'Repita a senha.',
              validate: (v) => v === getValues('senha') || 'As senhas não são iguais.',
            })} />
        </>
      )}

      <button type="submit" disabled={enviando} className={BOTAO_ENVIAR}>
        {enviando ? textoEnviando : textoBotao}
      </button>
    </form>
  );
}
