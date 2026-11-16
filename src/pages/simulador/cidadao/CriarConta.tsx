/**
 * Página: Criar conta (aba Cidadão → celular, /simulador/cidadao/criar-conta)
 * Cadastro com nome, Cartão SUS, celular, nascimento, sexo, contato de recado e senha.
 * Depois de criar, a pessoa já fica logada e volta para onde estava (como no Entrar).
 * Veio do protótipo: src/pages/cidadao/CriarConta.tsx.
 * Endpoints: POST /cidadaos (API Java, com tpAcesso SENHA e senha).
 * Estados: enviando ("Criando conta...") e erro (400 dados inválidos, 409 já existe conta com este Cartão SUS).
 * Regra RN21: quem foi cadastrado no balcão (sem senha) cria a conta com o mesmo Cartão SUS e mantém as consultas.
 */
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import MensagemErro from '../../../components/MensagemErro';
import FormularioCidadao, { type DadosCidadao } from '../../../components/celular/FormularioCidadao';
import { useSimulador } from '../../../context/useSimulador';
import { useEntrarNaListaDoDia } from '../../../hooks/useEntrarNaListaDoDia';
import { criarConta } from '../../../services/api';
import { BASE_CELULAR, destinoAposLogin, lerRetornoLogin, queryRetorno } from '../../../services/navegacao';
import { mensagemDoErro } from '../../../utils/erros';

/** Tela Criar conta do celular. */
export default function CriarConta() {
  const { estado, definirCidadaoAtual } = useSimulador();
  const entrarNaLista = useEntrarNaListaDoDia();
  const navigate = useNavigate();
  const [parametros] = useSearchParams();
  const retorno = lerRetornoLogin(parametros);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  /** Cria a conta, deixa a pessoa logada e volta para onde estava. */
  const aoEnviar = async (dados: DadosCidadao, senha?: string) => {
    setEnviando(true);
    setErro(null);
    try {
      const cidadao = await criarConta(dados, senha ?? '');
      definirCidadaoAtual(cidadao.idCidadao);
      if (retorno.destino === 'lista-do-dia' && retorno.ubs) entrarNaLista(retorno.ubs);
      navigate(destinoAposLogin(retorno), { replace: true });
    } catch (e) {
      setErro(mensagemDoErro(e));
      setEnviando(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold text-primaria">Criar conta</h1>
      <p className="text-base text-textoSuave">Confira seu celular: é por ele que avisamos a confirmação e as vagas.</p>
      {erro && <MensagemErro mensagem={erro} />}
      <FormularioCidadao
        nrCep={estado.orientacaoAtual?.nrCep ?? ''}
        aoEnviar={(d, s) => void aoEnviar(d, s)}
        pedirSenha
        textoBotao="Criar conta"
        textoEnviando="Criando conta..."
        enviando={enviando}
      />
      <p className="text-center">
        Já tem conta?{' '}
        <Link to={`${BASE_CELULAR}/entrar${queryRetorno(retorno)}`} className="font-bold text-primaria underline">Entrar</Link>
      </p>
    </div>
  );
}
