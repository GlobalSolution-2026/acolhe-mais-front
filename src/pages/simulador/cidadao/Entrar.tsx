/**
 * Página: Entrar (aba Cidadão → celular, /simulador/cidadao/entrar)
 * Login com Cartão SUS (15 números) e senha. Depois de entrar, volta para onde a pessoa estava:
 * agendamento, ficha de saúde, lista do dia (já entrando nela) ou Perfil.
 * O botão "Entrar com gov.br" fica desativado (disponível após a adesão do município).
 * Veio do protótipo: src/pages/cidadao/Entrar.tsx.
 * Endpoints: POST /cidadaos/login (API Java; sem VITE_API_URL, demonstração com as contas de data/contaDemo.ts).
 * Estados: enviando ("Entrando...") e erro (401: Cartão SUS ou senha incorretos).
 */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import CampoFormulario from '../../../components/CampoFormulario';
import MensagemErro from '../../../components/MensagemErro';
import SeloDemonstracao from '../../../components/SeloDemonstracao';
import { useSimulador } from '../../../context/useSimulador';
import { CONTA_DEMO } from '../../../data/contaDemo';
import { useEntrarNaListaDoDia } from '../../../hooks/useEntrarNaListaDoDia';
import { API_URL, entrar } from '../../../services/api';
import { BASE_CELULAR, destinoAposLogin, lerRetornoLogin, queryRetorno } from '../../../services/navegacao';
import { mensagemDoErro } from '../../../utils/erros';
import { regrasCartaoSus, regrasSenhaEntrar } from '../../../utils/validacoes';

/** Campos do login. */
interface EntrarForm {
  nrCns: string;
  senha: string;
}

/** Classe do botão principal do formulário. */
const BOTAO =
  'flex min-h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-primaria px-5 font-bold text-branco shadow-leve hover:bg-primariaEscura disabled:cursor-not-allowed disabled:opacity-60';

/** Tela Entrar do celular. */
export default function Entrar() {
  const { estado, definirCidadaoAtual } = useSimulador();
  const entrarNaLista = useEntrarNaListaDoDia();
  const navigate = useNavigate();
  const [parametros] = useSearchParams();
  const retorno = lerRetornoLogin(parametros);
  const [erro, setErro] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EntrarForm>();
  const nomeUbs = estado.unidades.find((u) => u.idUnidade === retorno.ubs)?.nmUnidade ?? 'UBS';

  /** Chama o login; com sucesso, guarda a conta no Context e volta para onde a pessoa estava. */
  const enviar = handleSubmit(async ({ nrCns, senha }) => {
    setErro(null);
    try {
      const cidadao = await entrar(nrCns, senha);
      definirCidadaoAtual(cidadao);
      if (retorno.destino === 'lista-do-dia' && retorno.ubs) entrarNaLista(retorno.ubs, cidadao.nmCidadao);
      navigate(destinoAposLogin(retorno), { replace: true });
    } catch (e) {
      setErro(mensagemDoErro(e));
    }
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold text-primaria">Entrar</h1>
      {retorno.horario > 0 && <p className="rounded-xl bg-mentaSuave p-3 font-semibold">Entre para concluir o agendamento.</p>}
      {retorno.destino === 'lista-do-dia' && (
        <p className="rounded-xl bg-mentaSuave p-3 font-semibold">
          {retorno.ubs ? `Entre para entrar na lista do dia da ${nomeUbs}.` : 'Entre para receber a vaga da lista do dia no seu nome.'}
        </p>
      )}
      {/* Sem a API Java, o login usa a conta de exemplo do modo demonstração */}
      {!API_URL && (
        <SeloDemonstracao descricao={`Conta de exemplo: Cartão SUS ${CONTA_DEMO.nrCns} e senha ${CONTA_DEMO.dsSenha}.`} />
      )}
      {erro && <MensagemErro mensagem={erro} />}

      <form onSubmit={enviar} className="flex flex-col gap-4" noValidate>
        <CampoFormulario id="nrCnsEntrar" label="Cartão SUS (15 números)" placeholder="000000000000000" numerico
          erro={errors.nrCns} registro={register('nrCns', regrasCartaoSus)} />
        <CampoFormulario id="senhaEntrar" label="Senha" tipo="password" alternarSenha erro={errors.senha}
          registro={register('senha', regrasSenhaEntrar)} />
        <button type="submit" disabled={isSubmitting} className={BOTAO}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="flex flex-col gap-1">
        <button type="button" disabled className="flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-xl border border-borda bg-branco px-5 font-bold text-textoSuave opacity-70">
          Entrar com gov.br
        </button>
        <p className="text-center text-sm text-textoSuave">Demonstração: disponível após a adesão do município</p>
      </div>

      <p className="text-center">
        Ainda não tem conta?{' '}
        <Link to={`${BASE_CELULAR}/criar-conta${queryRetorno(retorno)}`} className="font-bold text-primaria underline">Criar conta</Link>
      </p>
    </div>
  );
}
