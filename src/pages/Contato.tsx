/**
 * Página: Contato (rota "/contato", página institucional)
 * Mostra o aviso de emergência, os canais de contato da equipe e o formulário
 * (nome, e-mail, assunto e mensagem) com validação do react-hook-form.
 * Veio da demonstração aprovada 05-contato.html.
 * Endpoints: nenhum. O envio passa por services/contato.ts, que fica sempre em demonstração
 * (não existe endpoint de contato nas APIs do grupo).
 * Estados: enviando (botão "Enviando..." desabilitado), enviado (tela de sucesso) e erro no envio.
 */
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import Etiqueta from '../components/Etiqueta';
import GrupoCampo from '../components/GrupoCampo';
import { ASSUNTOS_CONTATO, CANAIS_CONTATO } from '../data/contato';
import { enviarMensagemContato } from '../services/contato';
import type { DadosContato } from '../types/institucional';
import { classeControle } from '../utils/estilosFormulario';

/** Situação do envio: preenchendo (com ou sem erro de envio) ou já enviado. */
type Situacao = 'preenchendo' | 'enviado';

/**
 * Junta os ids da dica e do erro para o aria-describedby do campo.
 * @returns os ids separados por espaço, ou undefined quando não há nenhum
 */
function descritoPor(id: string, temDica: boolean, temErro: boolean): string | undefined {
  const ids = [temDica && `${id}-dica`, temErro && `${id}-erro`].filter(Boolean);
  return ids.length ? ids.join(' ') : undefined;
}

/** Página Contato. */
export default function Contato() {
  const [situacao, setSituacao] = useState<Situacao>('preenchendo');
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DadosContato>({ defaultValues: { nome: '', email: '', assunto: '', mensagem: '' } });

  /** Envia a mensagem; se falhar, mantém o que foi escrito e mostra o erro. */
  const enviar = async (dados: DadosContato) => {
    setErroEnvio(null);
    try {
      await enviarMensagemContato(dados);
      setSituacao('enviado');
    } catch {
      setErroEnvio('Não foi possível enviar agora. Tente de novo em alguns minutos.');
    }
  };

  /** Volta ao formulário vazio para escrever outra mensagem. */
  const novaMensagem = () => {
    reset();
    setSituacao('preenchendo');
  };

  return (
    <>
      {/* 1. Abertura */}
      <section className="bg-branco">
        <div className="mx-auto flex max-w-6xl flex-col px-4 py-14 lg:px-6 lg:py-20">
          <Etiqueta>Contato</Etiqueta>
          <h1 className="mt-5 max-w-3xl text-3xl font-extrabold leading-tight text-primaria sm:text-5xl">
            Fale com a equipe do Acolhe+
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-texto">
            Tire dúvidas sobre a orientação, conte um problema no site ou fale sobre o uso na sua UBS ou secretaria.
          </p>
        </div>
      </section>

      <section className="border-t border-borda bg-fundo">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[5fr_7fr] lg:px-6">
          {/* 2. Aviso de emergência e canais de contato */}
          <div className="flex flex-col gap-6">
            {/* Regra: o formulário não é canal de urgência; quem precisa de socorro liga para o 192. */}
            <div className="rounded-2xl border-2 border-gravidade-vermelho bg-branco p-5">
              <p className="font-bold text-gravidade-vermelho">Não use este formulário em emergências</p>
              <p className="mt-1 text-texto">Ligue 192 (SAMU). Em caso de intoxicação, 0800 722 6001.</p>
            </div>
            <ul className="flex flex-col gap-4">
              {CANAIS_CONTATO.map(({ rotulo, valor, detalhe }) => (
                <li key={rotulo} className="rounded-2xl border border-borda bg-branco p-5">
                  <p className="text-sm font-bold text-textoSuave">{rotulo}</p>
                  <p className="mt-1 font-bold text-primaria">{valor}</p>
                  <p className="text-sm text-textoSuave">{detalhe}</p>
                </li>
              ))}
            </ul>
            <p className="text-sm text-textoSuave">Para falar sobre a sua consulta, procure a recepção da sua UBS.</p>
          </div>

          {/* 3. Formulário ou tela de sucesso */}
          <div className="rounded-3xl border border-borda bg-branco p-6 shadow-leve sm:p-8">
            {situacao === 'enviado' ? (
              <div role="status" className="flex flex-col items-start gap-3 py-6">
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-menta text-2xl font-extrabold text-primariaEscura"
                >
                  ✓
                </span>
                <h2 className="text-2xl font-extrabold text-primaria">Mensagem enviada!</h2>
                <p className="text-texto">A equipe responde no e-mail informado em até 1 dia útil.</p>
                <button
                  type="button"
                  onClick={novaMensagem}
                  className="min-h-12 cursor-pointer font-bold text-primaria underline decoration-menta decoration-4 underline-offset-4"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(enviar)} noValidate className="flex flex-col gap-5">
                <h2 className="text-xl font-extrabold text-primaria">Envie uma mensagem</h2>

                <GrupoCampo id="nome" label="Nome" erro={errors.nome}>
                  <input
                    id="nome"
                    type="text"
                    autoComplete="name"
                    aria-invalid={!!errors.nome}
                    aria-describedby={descritoPor('nome', false, !!errors.nome)}
                    className={classeControle(!!errors.nome)}
                    {...register('nome', {
                      // trim: espaços nas pontas não contam como letras
                      validate: (valor) =>
                        valor.trim().length >= 3 || 'Informe o seu nome (pelo menos 3 letras).',
                    })}
                  />
                </GrupoCampo>

                <GrupoCampo id="email" label="E-mail" erro={errors.email}>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="nome@exemplo.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={descritoPor('email', false, !!errors.email)}
                    className={classeControle(!!errors.email)}
                    {...register('email', {
                      required: 'E-mail inválido: use o formato nome@exemplo.com.',
                      pattern: {
                        value: /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i,
                        message: 'E-mail inválido: use o formato nome@exemplo.com.',
                      },
                    })}
                  />
                </GrupoCampo>

                <GrupoCampo id="assunto" label="Assunto" erro={errors.assunto}>
                  <select
                    id="assunto"
                    aria-invalid={!!errors.assunto}
                    aria-describedby={descritoPor('assunto', false, !!errors.assunto)}
                    className={classeControle(!!errors.assunto)}
                    {...register('assunto', { required: 'Escolha um assunto.' })}
                  >
                    <option value="">Escolha um assunto</option>
                    {ASSUNTOS_CONTATO.map((assunto) => (
                      <option key={assunto}>{assunto}</option>
                    ))}
                  </select>
                </GrupoCampo>

                <GrupoCampo
                  id="mensagem"
                  label="Mensagem"
                  dica="Não envie dados de saúde por aqui."
                  erro={errors.mensagem}
                >
                  <textarea
                    id="mensagem"
                    rows={5}
                    aria-invalid={!!errors.mensagem}
                    aria-describedby={descritoPor('mensagem', true, !!errors.mensagem)}
                    className={`${classeControle(!!errors.mensagem)} resize-none py-3`}
                    {...register('mensagem', {
                      validate: (valor) =>
                        valor.trim().length >= 10 || 'Escreva a mensagem (pelo menos 10 caracteres).',
                    })}
                  />
                </GrupoCampo>

                {erroEnvio && (
                  <p role="alert" className="text-sm font-semibold text-gravidade-vermelho">
                    {erroEnvio}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-xl bg-primaria px-6 font-bold text-branco shadow-leve hover:bg-primariaEscura disabled:cursor-not-allowed disabled:bg-textoSuave sm:w-fit"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
